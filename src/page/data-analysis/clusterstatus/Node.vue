<template>
    <div>
        <el-row>
            <el-col>
                <Picker @getDate="handleClickSearch"></Picker>
            </el-col>
        </el-row>
    </div>
</template>
<style scoped>
.top{
  margin-top: 10px;
}
.el-scrollbar__wrap{
  overflow-x: hidden;
}
.echarts {
    width: 100%;
    height: 600px;
}
</style>
<script>
import Picker from '@/components/dateTab/DatePickerSmall'
export default {
    data(){
        return {
            queryDate: ''
        }
    },
    components:{
        Picker
    },
    methods:{
        handleClickSearch(dateValue){
            if(dateValue!=null && dateValue.length == 2){
                /* dateValue[1] = dateValue[1]+24*60*60*1000-1;
                this.queryDate = dateValue; */
                this.queryDate[0] = dateValue[0];
                this.queryDate[1] = dateValue[1]+24*60*60*1000-1;
            }else{
                //设置为默认的查询时间
                this.setDefaultDate();
            }
        },
        setDefaultDate(){
            //默认查询为当前30天
            //获取当天结束时间的时间（23:59）
            var nowDayEnd = new Date(
                new Date(new Date().toLocaleDateString()).getTime() +
                24 * 60 * 60 * 1000 -
                1
            );
            //查询时间终止时间
            var endTimeStamp = Date.parse(nowDayEnd);
            //查询起始时间：终止时间前推30天(00:00)
            var startTimeStamp = Date.parse(
                new Date(nowDayEnd.getTime() - 30 * 24 * 60 * 60 * 1000 + 1)
            );

            //当前默认的查询日期前30天
            this.queryDate = [startTimeStamp, endTimeStamp];
        }
    }
}
</script>