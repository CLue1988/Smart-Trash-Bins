var colors = require('colors');
var pg = require('pg');
var types = require('pg').types;
types.setTypeParser(1700, 'text', parseFloat);
var _ = require('underscore');
var database_url = require('../../server.js').database_url;
var Ajv = require('ajv');
var ajv = new Ajv();
var validate = ajv.compile(require('../../models/trash_bin'));


// PUT
exports.request = function(req, res) {

    // Validate input
    if (!validate(req.body)) { // TODO: Check if all parameters were sent

        console.error(colors.red('Validation error:', validate.errors[0].message));
        res.status(405).send(validate.errors);

    } else {

        // Connect to database
        pg.connect(database_url, function(err, client, done) {
            if (err) {
                done();
                console.error(err);
            } else {

                // Prepare query
                var query = ""; // TODO: Check if Trash Bin exists with requested trash_bin_id

                // Database query
                client.query(query, [
                    req.params.trash_bin_id
                ], function(err, result) {
                    done();

                    if (err) {
                        res.status(500).send(err);
                        console.error(colors.red(err));
                    } else {

                        // Check if Trash_Bin exists
                        if (result.rows.length === 0) {
                            res.status(404).send('Trash bin not found!');
                            console.error(colors.red('Trash bin not found!'));
                        } else {

                            // Prepare query
                            var query = ""; // TODO: Update all attributes of the Trash Bin
                            
                            // Database query
                            client.query(query, [
                                req.params.trash_bin_id,
                                req.body.description,
                                req.body.filling_height,
                                req.body.capacity
                            ], function(err, result) {
                                done();

                                if (err) {
                                    res.status(500).send(err);
                                    console.error(colors.red(err));
                                } else {

                                    // Check if Trash_Bin exists
                                    if (result.rows.length === 0) {
                                        res.status(404).send('Trash bin not found!');
                                        console.error(colors.red('Trash bin not found!'));
                                    } else {

                                        // Send Result
                                        res.status(200).send(result.rows[0]);
                                    }
                                }
                            });

                        }
                    }
                });
            }
        });
    }
};
