 import {get_cookie} from "../utils/utils.js"
  
    let paramValue = get_cookie("name")
     document.getElementById("UsName").innerHTML = paramValue;
 