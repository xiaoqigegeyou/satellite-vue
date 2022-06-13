// sqlMap.js  sql语句
const sqlMap = {
    Satellite: {
        // add: 'insert into axios_demo(stu_Id,stu_name,stu_sex,stu_college,stu_class) values (0,?,?,?,?)',
        show: `select * from basic_conf_satellite`,
        //添加信息
        insert: `INSERT INTO basic_conf_satellite VALUES(null,?)`,
        //删除
        delete:`DELETE FROM basic_conf_satellite WHERE satellite_name = ?`
        // del: 'delete from axios_demo where stu_Id = ?',
        // update: 'update axios_demo set stu_name = ?,stu_sex = ?,stu_college = ?,stu_class = ? where stu_Id = ?'
    },
    Application:{
        //查询application_info_history表，按照每天进行分组
        showByTimeAndStatusHisSuccess: `SELECT DATE_FORMAT(finished_time,'%Y-%m-%d') AS 'day',COUNT(1) AS 'amount'
            FROM application_info_history
            WHERE step_id=13 AND final_status= ? AND finished_time BETWEEN ? AND ?
            GROUP BY DATE_FORMAT(finished_time,'%Y-%m-%d')
            ORDER BY DATE_FORMAT(finished_time,'%Y-%m-%d')`,
        //查询application_info_today表按照每天进行分组
        //TODO application_info_today生产环境需要改成application_info
        showByTimeAndStatusTodaySuccess: `SELECT DATE_FORMAT(finished_time,'%Y-%m-%d') AS 'day',COUNT(1) AS 'amount'
            FROM application_info
            WHERE step_id=13 AND final_status= ? AND finished_time BETWEEN ? AND ?
            GROUP BY DATE_FORMAT(finished_time,'%Y-%m-%d')
            ORDER BY DATE_FORMAT(finished_time,'%Y-%m-%d')`,
        //查询application_info_history表，按照每天进行分组
        showByTimeAndStatusHisFail: `SELECT DATE_FORMAT(finished_time,'%Y-%m-%d') AS 'day',COUNT(DISTINCT job_id,product_id) AS 'amount'
            FROM application_info_history
            WHERE final_status= ? AND finished_time BETWEEN ? AND ?
            GROUP BY DATE_FORMAT(finished_time,'%Y-%m-%d')
            ORDER BY DATE_FORMAT(finished_time,'%Y-%m-%d')`,
        //查询application_info_today表按照每天进行分组
        //TODO application_info_today生产环境需要改成application_info
        showByTimeAndStatusTodayFail: `SELECT DATE_FORMAT(finished_time,'%Y-%m-%d') AS 'day',COUNT(DISTINCT job_id,product_id) AS 'amount'
            FROM application_info
            WHERE final_status= ? AND finished_time BETWEEN ? AND ?
            GROUP BY DATE_FORMAT(finished_time,'%Y-%m-%d')
            ORDER BY DATE_FORMAT(finished_time,'%Y-%m-%d')`,
        //查询application_info_history表，按照步骤进行分组
        showByStepAndStatusHis: `SELECT step.id,step_name, COUNT(app.id) AS 'amount'
            FROM application_info_history app
            RIGHT JOIN basic_conf_step step ON step_id = step.id
            WHERE final_status= ? AND finished_time BETWEEN ? AND ?
            GROUP BY step.id
            ORDER BY step.id`,
        //查询application_info_today表，按照步骤进行分组
        //TODO application_info_today生产环境需要改成application_info
        showByStepAndStatusToday: `SELECT step.id,step_name, COUNT(app.id) AS 'amount'
            FROM application_info app
            RIGHT JOIN basic_conf_step step ON step_id = step.id
            WHERE final_status= ? AND finished_time BETWEEN ? AND ?
            GROUP BY step.id
            ORDER BY step.id`,
        //查询application_info_history表，按照卫星名进行分组 WHERE final_status = 'SUCCEEDED' AND finished_time BETWEEN '2019-9-01 00:00:00' AND '2019-11-01 00:00:00'
        showBySatelliteAndStatusHisSuccess: `SELECT satellite_name AS 'name',COUNT(1) AS 'value' FROM application_info_history
            WHERE step_id=13 AND final_status= ? AND finished_time BETWEEN ? AND ?
            GROUP BY satellite_name`,
        //查询application_info_today表，按照卫星名进行分组
        //TODO application_info_today生产环境需要改成application_info 成功的
        showBySatelliteAndStatusTodaySuccess: `SELECT satellite_name AS 'name',COUNT(1) AS 'value' FROM application_info
            WHERE step_id=13 AND final_status= ? AND finished_time BETWEEN ? AND ?
            GROUP BY satellite_name`,
        //查询application_info_history表，按照卫星名进行分组 WHERE final_status = 'SUCCEEDED' AND finished_time BETWEEN '2019-9-01 00:00:00' AND '2019-11-01 00:00:00'
        showBySatelliteAndStatusHisFail: `SELECT satellite_name AS 'name',COUNT(DISTINCT job_id,product_id) AS 'value' FROM application_info_history
            WHERE final_status= ? AND finished_time BETWEEN ? AND ?
            GROUP BY satellite_name`,
        //查询application_info_today表，按照卫星名进行分组
        //TODO application_info_today生产环境需要改成application_info 成功的
        showBySatelliteAndStatusTodayFail: `SELECT satellite_name AS 'name',COUNT(DISTINCT job_id,product_id) AS 'value' FROM application_info
            WHERE final_status= ? AND finished_time BETWEEN ? AND ?
            GROUP BY satellite_name`,
        //当天链路信息
        showByDataDisposeToday: `SELECT ROW_NUMBER() OVER (ORDER BY finished_time  DESC) -1 as id,
		a.job_id,CONCAT(a.satellite_name,'_',a.product_id) AS job_name,b.province_name,
		a.finished_time,a.final_status,a.step_id,e.steps,a.scene_no
            FROM (SELECT job_id,orbit_no,scene_no,satellite_name,product_id,province_id,finished_time,final_status,step_id,
            ROW_NUMBER() OVER ( PARTITION BY product_id ORDER BY step_id DESC ) AS num
            FROM application_info) a 
            JOIN basic_conf_provincial b ON IFNULL(a.province_id,'-1') = b.code
            JOIN (SELECT d.satellite_name,GROUP_CONCAT(f.step_name ORDER BY c.sort_no) steps
            FROM basic_conf_satellite_process c 
            JOIN basic_conf_step f ON f.id = c.step_id
            JOIN basic_conf_satellite d ON c.satellite_id = d.id
            GROUP BY satellite_name) e ON a.satellite_name = e.satellite_name
            WHERE num = 1 AND a.orbit_no= ? 
            ORDER BY finished_time DESC`,
        //当天链路信息无圈号NULL
        showByDataDisposeTodayNULL: `SELECT ROW_NUMBER() OVER (ORDER BY finished_time  DESC) -1 as id,
		a.job_id,CONCAT(a.satellite_name,'_',a.product_id) AS job_name,b.province_name,
		a.finished_time,a.final_status,a.step_id,e.steps,a.scene_no
            FROM (SELECT job_id,orbit_no,scene_no,satellite_name,product_id,province_id,finished_time,final_status,step_id,
            ROW_NUMBER() OVER ( PARTITION BY product_id ORDER BY step_id DESC ) AS num
            FROM application_info) a 
            JOIN basic_conf_provincial b ON IFNULL(a.province_id,'-1') = b.code
            JOIN (SELECT d.satellite_name,GROUP_CONCAT(f.step_name ORDER BY c.sort_no) steps
            FROM basic_conf_satellite_process c 
            JOIN basic_conf_step f ON f.id = c.step_id
            JOIN basic_conf_satellite d ON c.satellite_id = d.id
            GROUP BY satellite_name) e ON a.satellite_name = e.satellite_name
            WHERE num = 1 AND a.orbit_no is NULL
            ORDER BY finished_time DESC`,
        //当天链路圈号信息
        showCircleToday:`SELECT ROW_NUMBER() OVER (ORDER BY a.orbit_no  DESC) -1 as id,IFNULL(a.orbit_no,'无圈号数据') AS orbit_no,
            COUNT(*) as num,SUM(final_status='SUCCEEDED') as success,SUM(final_status='FAILED') as error,'' as dicts
            FROM (SELECT orbit_no,final_status,ROW_NUMBER() OVER ( PARTITION BY product_id ORDER BY step_id DESC ) AS num FROM application_info) a 
            WHERE num = 1 
            GROUP BY orbit_no
			ORDER BY id`,
        //历史链路圈号信息
        showCircleHis:`SELECT ROW_NUMBER() OVER (ORDER BY a.orbit_no  DESC) -1 as id,IFNULL(a.orbit_no,'无圈号数据') AS orbit_no,
            COUNT(*) as num,SUM(final_status='SUCCEEDED') as success,SUM(final_status='FAILED') as error,'' as dicts
            FROM (SELECT orbit_no,final_status,finished_time,ROW_NUMBER() OVER ( PARTITION BY product_id ORDER BY step_id DESC ) AS num FROM application_info_history
            WHERE finished_time BETWEEN ? AND ?) a 
            WHERE num = 1 
            GROUP BY orbit_no
			ORDER BY id`,
        //历史链路信息
        showByDataDisposeHis: `SELECT ROW_NUMBER() OVER (ORDER BY finished_time  DESC) -1 as id,
		a.job_id,CONCAT(a.satellite_name,'_',a.product_id) AS job_name,b.province_name,
		a.finished_time,a.final_status,a.step_id,e.steps,a.scene_no
            FROM (SELECT job_id,orbit_no,scene_no,satellite_name,product_id,province_id,finished_time,final_status,step_id,
            ROW_NUMBER() OVER ( PARTITION BY product_id ORDER BY step_id DESC ) AS num
            FROM application_info_history WHERE finished_time BETWEEN ? AND ?) a 
            JOIN basic_conf_provincial b ON IFNULL(a.province_id,'-1') = b.code
            JOIN (SELECT d.satellite_name,GROUP_CONCAT(f.step_name ORDER BY c.sort_no) steps
            FROM basic_conf_satellite_process c 
            JOIN basic_conf_step f ON f.id = c.step_id
            JOIN basic_conf_satellite d ON c.satellite_id = d.id
            GROUP BY satellite_name) e ON a.satellite_name = e.satellite_name
            WHERE num = 1 AND a.orbit_no= ? 
            ORDER BY finished_time DESC`,
        //历史链路信息无圈号NULL
        showByDataDisposeHisNULL: `SELECT ROW_NUMBER() OVER (ORDER BY finished_time  DESC) -1 as id,
		a.job_id,CONCAT(a.satellite_name,'_',a.product_id) AS job_name,b.province_name,
		a.finished_time,a.final_status,a.step_id,e.steps,a.scene_no
            FROM (SELECT job_id,orbit_no,scene_no,satellite_name,product_id,province_id,finished_time,final_status,step_id,
            ROW_NUMBER() OVER ( PARTITION BY product_id ORDER BY step_id DESC ) AS num
            FROM application_info_history WHERE finished_time BETWEEN ? AND ?) a 
            JOIN basic_conf_provincial b ON IFNULL(a.province_id,'-1') = b.code
            JOIN (SELECT d.satellite_name,GROUP_CONCAT(f.step_name ORDER BY c.sort_no) steps
            FROM basic_conf_satellite_process c 
            JOIN basic_conf_step f ON f.id = c.step_id
            JOIN basic_conf_satellite d ON c.satellite_id = d.id
            GROUP BY satellite_name) e ON a.satellite_name = e.satellite_name
            WHERE num = 1 AND a.orbit_no is NULL
            ORDER BY finished_time DESC`,
        //条件查询链路圈号信息
        showCirclePro:`SELECT ROW_NUMBER() OVER (ORDER BY a.orbit_no  DESC) -1 as id,IFNULL(a.orbit_no,'无圈号数据') AS orbit_no,
            COUNT(*) as num,SUM(final_status='SUCCEEDED') as success,SUM(final_status='FAILED') as error,'' as dicts
            FROM (SELECT orbit_no,scene_no,final_status,finished_time,ROW_NUMBER() OVER ( PARTITION BY product_id ORDER BY step_id DESC ) AS num FROM application_info_history
            WHERE IF(? = -1,1=1,orbit_no=?) and IF(? = -1,0=0,scene_no=?)) a 
            WHERE num = 1 
            GROUP BY orbit_no
			ORDER BY id`,
        //条件查询链路信息
        showByDataDisposePro: `SELECT ROW_NUMBER() OVER (ORDER BY finished_time  DESC) -1 as id,
		a.job_id,CONCAT(a.satellite_name,'_',a.product_id) AS job_name,b.province_name,
		a.finished_time,a.final_status,a.step_id,e.steps,a.scene_no
            FROM (SELECT job_id,orbit_no,scene_no,satellite_name,product_id,province_id,finished_time,final_status,step_id,
            ROW_NUMBER() OVER ( PARTITION BY product_id ORDER BY step_id DESC ) AS num
            FROM application_info_history 
            WHERE IF(? = -1,1=1,orbit_no=?) and IF(? = -1,0=0,scene_no=?)) a 
            JOIN basic_conf_provincial b ON IFNULL(a.province_id,'-1') = b.code
            JOIN (SELECT d.satellite_name,GROUP_CONCAT(f.step_name ORDER BY c.sort_no) steps
            FROM basic_conf_satellite_process c 
            JOIN basic_conf_step f ON f.id = c.step_id
            JOIN basic_conf_satellite d ON c.satellite_id = d.id
            GROUP BY satellite_name) e ON a.satellite_name = e.satellite_name
            WHERE num = 1  
            ORDER BY finished_time DESC`,
        //条件查询链路信息无圈号NULL
        showByDataDisposeProNULL: `SELECT ROW_NUMBER() OVER (ORDER BY finished_time  DESC) -1 as id,
		a.job_id,CONCAT(a.satellite_name,'_',a.product_id) AS job_name,b.province_name,
		a.finished_time,a.final_status,a.step_id,e.steps,a.scene_no
            FROM (SELECT job_id,orbit_no,scene_no,satellite_name,product_id,province_id,finished_time,final_status,step_id,
            ROW_NUMBER() OVER ( PARTITION BY product_id ORDER BY step_id DESC ) AS num
            FROM application_info_history 
            WHERE IF(? = -1,0=0,scene_no=?)) a 
            JOIN basic_conf_provincial b ON IFNULL(a.province_id,'-1') = b.code
            JOIN (SELECT d.satellite_name,GROUP_CONCAT(f.step_name ORDER BY c.sort_no) steps
            FROM basic_conf_satellite_process c 
            JOIN basic_conf_step f ON f.id = c.step_id
            JOIN basic_conf_satellite d ON c.satellite_id = d.id
            GROUP BY satellite_name) e ON a.satellite_name = e.satellite_name
            WHERE num = 1 AND a.orbit_no is NULL
            ORDER BY finished_time DESC`,
        //全部链路圈号信息
        showCircleAll:`SELECT ROW_NUMBER() OVER (ORDER BY a.orbit_no  DESC) -1 as id,IFNULL(a.orbit_no,'无圈号数据') AS orbit_no,
            COUNT(*) as num,SUM(final_status='SUCCEEDED') as success,SUM(final_status='FAILED') as error,'' as dicts
            FROM (SELECT orbit_no,final_status,finished_time,ROW_NUMBER() OVER ( PARTITION BY product_id ORDER BY step_id DESC ) AS num 
            FROM application_info_history) a 
            WHERE num = 1 
            GROUP BY orbit_no
			ORDER BY id`,
    },
    User:{
        insert: `INSERT INTO user_info VALUES(null,?,?,null,1)`,
        selectByUsername: `SELECT COUNT(1) AS 'amount' FROM user_info WHERE user_name = ?`,
        selectByUsernameAndPassword: `SELECT user_name FROM user_info WHERE user_name = ? AND passwd=? AND locked=1`
    },
    BasicConfCluster:{
        //查询全部节点信息配置
        selectAll: `SELECT * FROM basic_conf_cluster`,
        //添加节点信息
        insert: `INSERT INTO basic_conf_cluster VALUES(null,?,?,?,?,?)`,
        //删除节点
        delete:`DELETE FROM basic_conf_cluster WHERE name = ?`
    },
    BasicConfStep:{
        //查询全部节点信息配置
        selectAll: `SELECT * FROM basic_conf_step`,
        //添加节点信息
        insert: `INSERT INTO basic_conf_stepr VALUES(?,?,?,null)`,
        //删除节点
        delete:`DELETE FROM basic_conf_step WHERE id = ?`
    },
    BasicConfProvincial:{
        //查询全部省份信息配置
        selectAll: `SELECT * FROM basic_conf_provincial`,
        //添加省份信息
        insert: `INSERT INTO basic_conf_provincial VALUES(null,?,?)`,
        //删除节点
        delete:`DELETE FROM basic_conf_provincial WHERE name = ?`

    },
    MapInfo:{
        //查询历史表中的所有节点的任务，统计任务时间（精确到天）和任务数量
        showAllNodePreJobAmountByDateHis: `SELECT DATE_FORMAT(finished_time,'%Y-%m-%d') AS 'day',COUNT(1) AS 'amount'
            FROM map_info_history
            WHERE finished_time BETWEEN ? AND ?
            GROUP BY DATE_FORMAT(finished_time,'%Y-%m-%d')
            ORDER BY DATE_FORMAT(finished_time,'%Y-%m-%d')`,
        //查询历史表中的指定节点的任务，统计任务时间（精确到天）和任务数量
        showOneNodePreJobAmountByDateHis: `SELECT DATE_FORMAT(finished_time,'%Y-%m-%d') AS 'day',COUNT(1) AS 'amount'
            FROM map_info_history
            WHERE map_node=? AND finished_time BETWEEN ? AND ?
            GROUP BY DATE_FORMAT(finished_time,'%Y-%m-%d')
            ORDER BY DATE_FORMAT(finished_time,'%Y-%m-%d')`,
        // 查询当天表中的所有节点的任务，统计任务时间（精确到天）和任务数量
        // TODO map_info_today 生产环境需改为 map_info
        showAllNodePreJobAmountByDateToday: `SELECT DATE_FORMAT(finished_time,'%Y-%m-%d') AS 'day',COUNT(1) AS 'amount'
            FROM map_info
            WHERE finished_time BETWEEN ? AND ?
            GROUP BY DATE_FORMAT(finished_time,'%Y-%m-%d')
            ORDER BY DATE_FORMAT(finished_time,'%Y-%m-%d')`,
        // 查询当天表中的指定节点的任务，统计任务时间（精确到天）和任务数量
        // TODO map_info_today 生产环境需改为 map_info
        showOneNodePreJobAmountByDateToday: `SELECT DATE_FORMAT(finished_time,'%Y-%m-%d') AS 'day',COUNT(1) AS 'amount'
            FROM map_info
            WHERE map_node=? AND finished_time BETWEEN ? AND ?
            GROUP BY DATE_FORMAT(finished_time,'%Y-%m-%d')
            ORDER BY DATE_FORMAT(finished_time,'%Y-%m-%d')`,
        // 分页显示所有的节点的任务历史表数据
        showAllNodePageByDateHis: `
        SELECT COUNT(1) FROM map_info_history WHERE finished_time BETWEEN ? AND ?;
            SELECT 
                id, 
                job_info_id AS 'jobId', 
                task_id AS 'taskID', 
                task_name AS 'taskName', 
                map_node AS 'node', 
                start_time AS 'startTime', 
                finished_time AS 'endTime', 
                elapsed_time AS 'runTime'
            FROM
                map_info_history
            WHERE finished_time BETWEEN ? AND ? limit ?,?`,
        //分页显示所有节点的任务包含当天表的数据 合并查询
        //TODO map_info_today 生产环境替换为 map_info
        showAllNodePageByDateAndToday: `
                    SELECT COUNT(1) FROM map_info WHERE finished_time BETWEEN ? AND ?;
                    SELECT COUNT(1) FROM map_info_history WHERE finished_time BETWEEN ? AND ?;
                    (SELECT
                        id, 
                        job_info_id AS 'jobId', 
                        task_id AS 'taskID', 
                        task_name AS 'taskName', 
                        map_node AS 'node', 
                        start_time AS 'startTime', 
                        finished_time AS 'endTime', 
                        elapsed_time AS 'runTime'
                    FROM
                        map_info
                    WHERE finished_time BETWEEN ? AND ?
                    )
                    UNION 
                    (
                    SELECT
                        id, 
                        job_info_id AS 'jobId', 
                        task_id AS 'taskID', 
                        task_name AS 'taskName', 
                        map_node AS 'node', 
                        start_time AS 'startTime', 
                        finished_time AS 'endTime', 
                        elapsed_time AS 'runTime'
                    FROM
                        map_info_history
                    WHERE finished_time BETWEEN ? AND ?
                    ) limit ?,?`,
        //分页显示指定节点的任务仅历史表的数据
        showOneNodePageByDateHis: `
        SELECT COUNT(1) FROM map_info_history WHERE map_node=? AND finished_time BETWEEN ? AND ?;
        SELECT 
                id, 
                job_info_id AS 'jobId', 
                task_id AS 'taskID', 
                task_name AS 'taskName', 
                map_node AS 'node', 
                start_time AS 'startTime', 
                finished_time AS 'endTime', 
                elapsed_time AS 'runTime'
            FROM
                map_info_history
            WHERE map_node=? AND finished_time BETWEEN ? AND ? limit ?,?`,
        //分页显示指定节点的任务包含当天表的数据 合并查询
        //TODO map_info_today 生产环境替换为 map_info
        showOneNodePageByDateAndToday: `
        SELECT COUNT(1) FROM map_info WHERE map_node=? AND finished_time BETWEEN ? AND ?;
        SELECT COUNT(1) FROM map_info_history WHERE map_node=? AND finished_time BETWEEN ? AND ?;
            (SELECT
                    id, 
                    job_info_id AS 'jobId', 
                    task_id AS 'taskID', 
                    task_name AS 'taskName', 
                    map_node AS 'node', 
                    start_time AS 'startTime', 
                    finished_time AS 'endTime', 
                    elapsed_time AS 'runTime'
                FROM
                    map_info
                WHERE map_node=? AND finished_time BETWEEN ? AND ?
                )
                UNION 
                (
                SELECT
                    id, 
                    job_info_id AS 'jobId', 
                    task_id AS 'taskID', 
                    task_name AS 'taskName', 
                    map_node AS 'node', 
                    start_time AS 'startTime', 
                    finished_time AS 'endTime', 
                    elapsed_time AS 'runTime'
                FROM
                    map_info_history
                WHERE map_node=? AND finished_time BETWEEN ? AND ?
                ) limit ?,?`,
        // 查询任务节点分布情况 查询历史表
        showTaskNodeDataByDateHis: `
            SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(map_node,'.',1),'-',-1) as 'name', count(1) AS 'value'  FROM map_info_history
            where state=? AND finished_time BETWEEN ? AND ?
            GROUP BY map_node   
        `,
        // 查询任务节点分布情况 查询当天表
        showTaskNodeDataByDateToday:`
            SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(map_node,'.',1),'-',-1) as 'name', count(1) AS 'value'  FROM map_info
            where state=? AND finished_time BETWEEN ? AND ?
            GROUP BY map_node
        `
    },
    Push:{
        //读取application 的 id 和圈号(当天表和历史表)
        selectCricleIdFromHisAndToday: `
            (SELECT id,orbit_no FROM application_info
                WHERE satellite_name = ? AND product_id=?)
                UNION
                (SELECT id,orbit_no FROM application_info_history
                WHERE satellite_name=? AND product_id=?)`,
        //插入推送的数据到application_info表
        insertPushDataToApplicationInfo: `INSERT INTO application_info(satellite_name,province_id,product_id,finished_time,timestamp,state,step_id,orbit_no,final_status)
        VALUES (?,?,?,?,?,?,?,?,?)`
    },
    Index:{
        //左侧
        selectLeft:`SELECT b.province_name,COUNT(*) as num,SUM(final_status='SUCCEEDED') as success,SUM(final_status='FAILED') as error
			FROM (SELECT province_id,final_status,ROW_NUMBER() OVER ( PARTITION BY product_id ORDER BY step_id DESC ) AS num FROM application_info) as a  
			JOIN basic_conf_provincial b ON  a.province_id = b.code
			GROUP BY province_name
			ORDER BY num DESC`,
        selectCenter:`SELECT COUNT(*) as num,SUM(a.final_status='SUCCEEDED') as success,SUM(a.final_status='FAILED') as error
			FROM (SELECT final_status,ROW_NUMBER() OVER ( PARTITION BY product_id ORDER BY step_id DESC ) AS num FROM application_info) as a
			WHERE num = 1 `,
        selectRight:`SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(map_node,'.',1),'-',-1) as 'name',
            COUNT(1) as num,SUM(state='SUCCEEDED') as success,SUM(state='FAILED') as error
            FROM map_info
            GROUP BY map_node
            ORDER BY name DESC `,
        selectRun:`SELECT COUNT(*) as runing FROM (SELECT final_status,ROW_NUMBER() OVER ( PARTITION BY product_id ORDER BY step_id DESC ) AS num 
			FROM application_info_run) as a WHERE num = 1 and a.final_status='RUNNING'`
    },
    ErrorDispose:{
        //卫星下拉框
        AllSatelliteName:`select * from basic_conf_satellite`,
        //省份下拉框
        AllProvinceName:`select * from basic_conf_provincial where code <> '-1'`,
        //步骤下拉框
        AllStepName:`select * from basic_conf_step where id>4`,
        //所有当天出错数据
        ALLErrorToday:`SELECT a.job_id,a.satellite_name,a.product_id,a.scene_no,a.orbit_no,b.province_name,c.step_name,a.finished_time
            FROM (SELECT job_id,satellite_name,product_id,IFNULL('无景号',scene_no) as scene_no,IFNULL('无圈号',orbit_no) as orbit_no,
            province_id,step_id,finished_time 
            FROM application_info WHERE final_status = 'FAILED') as a
            JOIN basic_conf_provincial b ON IFNULL(a.province_id,'-1') = b.code
            JOIN basic_conf_step c ON a.step_id = c.id
            where a.step_id>4
            ORDER BY a.finished_time DESC`,
        //所有历史出错数据
        ALLErrorHis:`SELECT a.job_id,a.satellite_name,a.product_id,a.scene_no,a.orbit_no,b.province_name,c.step_name,a.finished_time
            FROM (SELECT job_id,satellite_name,product_id,IFNULL('无景号',scene_no) as scene_no,IFNULL('无圈号',orbit_no) as orbit_no,
            province_id,step_id,finished_time 
            FROM application_info_history WHERE final_status = 'FAILED') as a
            JOIN basic_conf_provincial b ON IFNULL(a.province_id,'-1') = b.code
            JOIN basic_conf_step c ON a.step_id = c.id
            where a.step_id>4
            ORDER BY a.finished_time DESC`,
        //查询当天出错数据
        selectErrorToday:`SELECT a.job_id,a.satellite_name,a.product_id,a.scene_no,a.orbit_no,b.province_name,c.step_name,a.finished_time
            FROM (SELECT job_id,satellite_name,product_id,IFNULL('无景号',scene_no) as scene_no,IFNULL('无圈号',orbit_no) as orbit_no,
            province_id,step_id,finished_time 
            FROM application_info WHERE final_status = 'FAILED'
            AND IF(? = '-1',1=1,job_id = ?)
            AND IF(? = '-1',2=2,product_id = ?)
            AND IF(? = '-1',3=3,scene_no = ?)
            AND IF(? = '-1',4=4,orbit_no = ?)
            AND IF(? = '-1',5=5,satellite_name = ?)
            AND IF(? = '-1',6=6,province_id = ?)
            AND IF(? = '-1',7=7,step_id = ?)) as a
            JOIN basic_conf_provincial b ON IFNULL(a.province_id,'-1') = b.code
            JOIN basic_conf_step c ON a.step_id = c.id
            where a.step_id>4
            ORDER BY a.finished_time DESC`,
        //查询历史出错数据
        selectErrorHis:`SELECT a.job_id,a.satellite_name,a.product_id,a.scene_no,a.orbit_no,b.province_name,c.step_name,a.finished_time
            FROM (SELECT job_id,satellite_name,product_id,IFNULL('无景号',scene_no) as scene_no,IFNULL('无圈号',orbit_no) as orbit_no,
            province_id,step_id,finished_time 
            FROM application_info_history WHERE final_status = 'FAILED'
            AND IF(? = '-1',1=1,job_id = ?)
            AND IF(? = '-1',2=2,product_id = ?)
            AND IF(? = '-1',3=3,scene_no = ?)
            AND IF(? = '-1',4=4,orbit_no = ?)
            AND IF(? = '-1',5=5,satellite_name = ?)
            AND IF(? = '-1',6=6,province_id = ?)
            AND IF(? = '-1',7=7,step_id = ?)) as a
            JOIN basic_conf_provincial b ON IFNULL(a.province_id,'-1') = b.code
            JOIN basic_conf_step c ON a.step_id = c.id
            where a.step_id>4
            ORDER BY a.finished_time DESC`,
    }
}

module.exports = sqlMap