
module.exports = {
    validateDays: (days)=>{
        if(days<1 || typeof(days)!='number' || days==null){
            return false;
        }
        return true;
    },

    //validateId check if params id is a valid number by checking if it is a number and is not a null
    validateId:(id)=>{
        if(typeof(id)!='number' || id==null){
            return false;
        }
        return true;
    },

    validateBook: (title, amount)=>{
        if( /^\d+$/.test(amount) && typeof(title)=='string' && title.length>0){
            return true;
        }
        return false;
    },

    validateBookUpdate: (bookId, amount)=>{
        return (typeof(bookId)=='number' && Number.isInteger(amount) && amount>0);
    },

}