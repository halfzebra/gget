var http  = require('http'),
    async = require('async');

/**
 * Prepares a request for a single API call.
 *
 * @param key
 *   API request key from GET parameter.
 * @param path
 *   Request path to the real API.
 * @param port
 *   Server port.
 * @returns {Function}
 */
function prepareReq(key, path, port) {

  return function (callback) {

    var options = {
          host: 'localhost',
          method: 'GET',
          port: port,
          path: path
        },
        res = {};

    http.request(options, function (response) {

      var apiRes = '';

      response.on('data', function (chunk) {
        apiRes += chunk;
      });

      response.on('end', function () {
        res[key] = apiRes;
        callback(null, res);
      });

      response.on('error', function (err) {

        // Callback for async.
        callback(err);
        console.log('Request error: ' + err.message);
      });
    }).end();
  }
}

/**
 * Convert response to associative array.
 *
 * @param results
 * @returns {}
 */
function prepareRes(results) {

  var resultsAssoc = {};

  results.forEach(function(element, index, array) {

    for(var key in element) {
      resultsAssoc[key] = element[key];
    }
  });

  return resultsAssoc;
}

/**
 * Prepares and sends the requests.
 *
 * @param port
 * @returns {Function}
 */
module.exports = function(port) {

  return function (req, res) {

    var reqQuery = req.query,
        resData = {},
        calls = [],
        path = '';

    // Loop through GET parameters and extract parameter names and API paths.
    for (var param in reqQuery) {

      path = '/' + reqQuery[param];

      calls.push(prepareReq(param, path, port));
    }

    // Send the parallel requests to the server and send a response.
    async.parallel(calls, function (err, results) {

      if (err !== null) {
        res.send(err);
      } else {

        res.json(prepareRes(results));
      }
    });
  }
};