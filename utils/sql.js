exports.programList = `select * from program where user_id=?`;
exports.programAdd = `insert into program(id,name,level,end_time,create_time,user_id) values(?,?,?,?,?,?)`;
exports.programHas = `select id from program where name= ? `;
exports.programDel = `delete program,landmarks,task 
                        from program
                         left join landmarks on program.id=landmarks.program_id
                         left join task on task.program_id=program.id 
                         where program.id= ? `;
exports.programDetail = `SELECT * FROM program WHERE id= `;
exports.programUpdate = `update program set name = ?,level = ?,end_time= ? WHERE id = ? `;
exports.programStartUp = `update program set start_time= ? WHERE id = ? `

//
exports.taskList = `select * from task where landmarks_id= ?`;
exports.taskHas = `select id from task where name= ? `;
exports.taskAdd = `insert into task(id,name,start_time,is_repeat,time_of_day,targets,description,create_time,landmarks_id,program_id,status) values(?,?,?,?,?,?,?,?,?,?,?)`;
exports.taskUpdate = `update task set name = ?,start_time= ?,is_repeat=?,time_of_day=?,targets=?,description=? WHERE id = ?`
exports.taskDel = `delete from task where id= ?`;

//
exports.accountDetail = `select * from account where account= ?`;
exports.accountAdd = `insert into account(id,type,user_id,account,password,phone,email,nikName,name,create_time) values(?,?,?,?,?,?,?,?,?,?)`

//
exports.landMasksList = `select * from landmarks where program_id=? order by end_time`;
exports.landMasksAdd = `insert into landmarks(id,program_id,name,create_time,end_time) values(?,?,?,?,?)`
exports.landMasksUpdate = `update landmarks set name = ?,end_time= ? WHERE id = ? `

exports.diaryAdd=`insert into diary(id,task_id,data,create_time) values(?,?,?,?)`
exports.diaryUpdate=`update diary set data = ? WHERE id = ? `

exports.statusAdd=`insert into status(id,record_id,create_time) values(?,?,?)`
