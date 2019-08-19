
module.exports = {
    validateDays: (days)=>{
        if(days<1 || typeof(days)!='number' || days==null){
            return false;
        }
        return true;
    },

    validateId:(id)=>{
        if(typeof(id)!='number' || id==null){
            return false;
        }
        return true;
    },

    validateBook: (title, quantity, id)=>{
        if(/^\d*$/.test(quantity) && /^\d*$/.test(id) && typeof(title)=='string'){
            return true;
        }
        return false;
    }
}