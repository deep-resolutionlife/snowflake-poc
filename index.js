const snowflake = require('snowflake-sdk');
const { getConnection, terminateConnection } = require("./connection");

const query = async() => {

    var connection = null;

    try {
        connection = await getConnection();
        console.log("connectionId is: ", connection.getId());
        return await connection.execute({
            sqlText: 'CALL SP_PI()',
            streamResult: true,
            complete: function (err, stmt, rows) {
              rows = [];
              stmt.streamRows({
                start: 0,
                end: 10,
              })
              .on('error', function(err) {
                console.error('Unable to consume requested rows');
              })
              .on('data', function(row) {
                rows.push(row);
                console.log("rows: ", rows);
              })
              .on('end', function() {
                console.log('Number of rows consumed: ' + rows.length);
              });

            }
          });

    } catch (e) {
        console.log("error: ", e);
        throw new Error(e.message);
    } finally {

      setTimeout(() => {
        terminateConnection(connection);
      }, 2000);

    }

}

query().then( async (result) => {
    // console.log("result: ", result)
});
