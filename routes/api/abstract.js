/**
 * Created by Game Station on 30.6.2017 г..
 */

/**
 * List Items
 */
exports.list = require("./abstract/abstract-list").list;

/**
 * Get Items By Id
 */
exports.getById = require("./abstract/abstract-by-id").getById;

/**
 * Get Items By Slug
 */
exports.getBySlug = require("./abstract/abstract-by-slug").getBySlug;

/**
* Get Items Matching a Query
*/
exports.getByQuery = require("./abstract/abstract-by-query").getByQuery;
