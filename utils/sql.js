exports.programList = `select * from program`;
exports.programAdd = `insert into program(id,name,des) values(?,?,?)`;
exports.programHas = `select id from program where name= ? `;
exports.programDel = `delete from program where id= ? `;
exports.programDetail=`SELECT * FROM program WHERE id= `;
exports.taskList = `select * from task where programId= ?`;
exports.taskHas = `select id from task where name= ? `;
exports.taskAdd = `insert into task(id,name,des,programId,type,duration,status,time) values(?,?,?,?,?,?,?,?)`;
exports.taskDel=`delete id from task where id= ?`;