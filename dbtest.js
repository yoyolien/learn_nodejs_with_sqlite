const sqlite3 = require('sqlite3').verbose();
var db;
db = new sqlite3.Database("mydatabase.db", function(e) {
  if (e) throw e;
});
db.run("CREATE TABLE foo(id INT)", function(err) {
  if (err) throw err;
  //使用 this.changes 获取改变的行数
  assert.equal(500, this.changes);
});
db.run("UPDATE foo SET id = 1 WHERE id <= 500", function(err) {
  if (err) throw err;
  //使用 this.changes 获取改变的行数
  assert.equal(500, this.changes);
  done();
});
