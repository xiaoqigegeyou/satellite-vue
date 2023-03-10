function dateFormatToSQL(time){
    let date = new Date(time);
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();

    if(month < 10){
        month = '0'+month;
    }
    if(day < 10){
        day = '0'+day;
    }
    if(hour<10){
        hour='0'+hour;
    }
    if(min<10){
        min='0'+min;
    }
    if(sec<10){
        sec='0'+sec;
    }

    return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
}
module.exports=dateFormatToSQL