exports.programList = `select * from program where user_id=?`;
exports.programAdd = `insert into program(id,name,level,end_time,create_time,user_id) values(?,?,?,?,?,?)`;
exports.programHas = `select id from program where name= ? `;
exports.programDel = `delete from program where id= ? `;
exports.programDetail=`SELECT * FROM program WHERE id= `;
exports.programUpdate=`update program set name = ?,level = ?,end_time= ? WHERE id = ? `;
exports.programStartUp=`update program set start_time= ? WHERE id = ? `

//
exports.taskList = `select * from task where programId= ?`;
exports.taskHas = `select id from task where name= ? `;
exports.taskAdd = `insert into task(id,name,des,programId,type,duration,status,time) values(?,?,?,?,?,?,?,?)`;
exports.taskDel=`delete id from task where id= ?`;

//
exports.accountDetail=`select * from account where account= ?`;
exports.accountAdd=`insert into account(id,type,user_id,account,password,phone,email,nikName,name,create_time) values(?,?,?,?,?,?,?,?,?,?)`

//
exports.landMasksList=`select * from landmarks where program_id=? order by end_time`;
exports.landMasksAdd=`insert into landmarks(id,program_id,name,create_time,end_time) values(?,?,?,?,?)`
exports.landMasksUpdate=`update landmarks set name = ?,end_time= ? WHERE id = ? `
