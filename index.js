const { options } = require('./lib/options');
const { fetch } = require('./lib/fetch');
const { flatten } = require('./lib/utils');
const Promise = require('bluebird');
const URL = require('./lib/gbk');
const limit = require('p-limit')(10);
let MOVIE_DETAIL_PAGE_URI_SELECTOR = '.co_content8 .ulink'; // .title-text
const MOVIE_TITLE_SELECTOR = '#header div.co_area2 > div.title_all > h1 > font';
const MOVIE_IMAGE_SELECTOR = '#Zoom span img';
const MOVIE_DOWNLOAD_LINK_SELECTOR = '#Zoom a';
const DEFAULT_INCLUDE = ['title', 'imgUrl', 'desc', 'downloadLink', 'descPageLink'];
const MOVIE_DESC_SELETOR = '#Zoom > span > p:nth-child(1)';
let MOVIE_HOST = 'https://www.dytt8.net';

/**
 * Get movie detail page links
 *
 * @param {Object} cheerio
 * @returns {Array} movieDetailPageLinks
 */
function handleGetMovieDetailPageLinks (cheerio) {
  return cheerio(MOVIE_DETAIL_PAGE_URI_SELECTOR).map((idx, ele) => {
    return cheerio(ele).attr('href');
  }).get() || [];
}

/**
 * Get movie details
 *
 * @param {Object} cheerio
 * @param {Object} config
 * @returns {Array} movieDetails
 */
function handleGetMovieDetails (cheerio, uri, config) {
  let { include } = config;
  if (!include.length) include = DEFAULT_INCLUDE;
  let result = {};
  include.forEach(item => {
    if (item === 'title') {
      const title = cheerio(MOVIE_TITLE_SELECTOR).text();
      if (title) result[item] = cheerio(MOVIE_TITLE_SELECTOR).text();
      else return false;
    }
    if (item === 'imgUrl') {
      const imgUrl = cheerio(MOVIE_IMAGE_SELECTOR).eq(0).map((idx, ele) => {
        return cheerio(ele).attr('src');
      }).get()[0];
      if (imgUrl) result[item] = imgUrl;
      else return false;
    }
    if (item === 'desc') {
      const desc = cheerio(MOVIE_DESC_SELETOR).text();
      if (desc) result[item] = desc;
      else return false;
    }
    if (item === 'downloadLink') {
      var downloadLink = cheerio(MOVIE_DOWNLOAD_LINK_SELECTOR);
      for (var i = 0; i < downloadLink.length; i++) {
        var href = cheerio(downloadLink[i]).attr('href');
        if (href.includes('magnet')) {
          result[item] = href;
        }
      }
    }
    if (item === 'descPageLink') {
      const descPageLink = uri;
      if (descPageLink) result[item] = descPageLink;
      else return false;
    }
  });
  return JSON.stringify(result) === '{}' ? undefined : result;
}

/**
 * Get Dytt movies
 *
 * @param {Object} config
 * @returns {Promise} movieDetails
 */
module.exports = (config) => {
  config =
      {
        page: 1,
        skip: 0,
        include: DEFAULT_INCLUDE,
        ...config
      };
  if (!config.page) throw Error('Config.page is required');
  if (config.skip < 0) throw Error('Skip must be greater than 0');
  if (config.page < 1) throw Error('Page must be greater than 1');

  if (config.search != '') {
    MOVIE_DETAIL_PAGE_URI_SELECTOR = '.co_content8 ul a';
    MOVIE_HOST = 'https://www.ygdy8.com';
  }

  let pool = [];
  for (let i = config.skip; i < config.page; i++) {
    let url = `https://www.dytt8.net/html/gndy/dyzz/list_23_${i + 1}.html`;

    if (config.search != '') {
      url = `http://s.ygdy8.com/plus/s01.php?typeid=1&keyword=${URL.encode(config.search)}`;
    }
    pool.push(limit(() =>
      fetch({ ...options(url) })
        .then($ => handleGetMovieDetailPageLinks($))
        .catch(err => err.toString())
    ));
  }
  return Promise.all(pool)
    .then(movieDetailPageLinks => flatten(movieDetailPageLinks)) // get solo movie link
    .then(movieDetailPageLinks => {
      pool = [];
      for (let i = 0; i < movieDetailPageLinks.length; i++) {
        pool.push(limit(() =>
          fetch({ ...options(`${MOVIE_HOST}${movieDetailPageLinks[i]}`) })
            .then($ => handleGetMovieDetails($, `${MOVIE_HOST}${movieDetailPageLinks[i]}`, config))
            .catch(err => err.toString())
        ));
      }
      return pool;
    })
    .then(pool => Promise.all(pool)) // get solo movie details
    .then(result => result.filter(v => v));
};
