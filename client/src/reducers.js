//user
export const userReducer = (state = false,action)=>{
    switch (action.type) {
        case 'LOGIN':
                        
            return action.payload;
        case 'LOGOUT':
            
            return false;

        default:
        return state;
    }

}
// searchFix לא מגניב תיקון מגעיל לפרוייקט!!!!
export const vacsReducer = (state = false,action)=>{
    switch (action.type) {
        case 'SEARCH':
                        
            return action.payload;
        case 'CANCELSEARCH':
            
            return false;

        default:
        return state;
    }

}


