
import configData from "../../../config.json";

 class coronacasesService {

     getRoot() {
       
        return configData.API_PROTOCOL + "://" + configData.API_IP +":"  + configData.API_PORT
         +"/" + configData.API_PATH ;
      }; 
    
      async  coronacases (start,size,region="",sortField = null, sortOrder = 'asc'){
        const API = this.getRoot();
        
        try {
          const response = await fetch(API+"/corona-cases?start="+start+"&size="+size+"&region="+region+"&sortField="+sortField+"&sortOrder="+sortOrder);
          if (!response.ok) {
            throw Error();
          }
          return response.json();
        } catch (error) {
          console.log(error);
        }
        
      };
    
     async  regions (){
        const API = this.getRoot();
        try {
          const response = await fetch(API+"/corona-cases/regions");
          if (!response.ok) {
            throw Error();
          }
          return response.json();
        } catch (error) {
          console.log(error);
        }
        
      };
}

export default  coronacasesService;
 