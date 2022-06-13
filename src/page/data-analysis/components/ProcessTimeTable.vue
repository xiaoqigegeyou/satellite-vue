<template>
    <el-card shadow="hover">
        <el-table :data="tableList" stripe height="520">
            <el-table-column prop="day" label=""  sortable></el-table-column>
            <el-table-column prop="amount" label="时间(s)" sortable></el-table-column>
             <el-table-column prop="name" label="节点" sortable ></el-table-column>
        </el-table>
    </el-card>
</template>
<script>
export default {
    props:['tableList'],
    data(){
        return {
            
        }
    }
}
</script>
<style lang="scss" scoped>

</style>