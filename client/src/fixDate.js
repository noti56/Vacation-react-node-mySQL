export const displayDate =(date)=>{
    if(date){
        let fixed = date.slice(0,10)
        return fixed;
    }else{
        console.log('something went wrong with the date')
    }

}

// הפונקציה הזו מחריזה את התאריך מהדאטה בייס בלי השעה.


