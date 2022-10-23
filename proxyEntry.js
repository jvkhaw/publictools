function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function waitForElmMultiple(selector) {
    return new Promise(resolve => {
        if (document.querySelectorAll(selector)) {
            return resolve(document.querySelectorAll(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelectorAll(selector)) {
                resolve(document.querySelectorAll(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

const parent = document.querySelector(".header-text");
const fileinput = document.createElement("input");
fileinput.type="file";
fileinput.accept=".txt";
parent.appendChild(fileinput);

// const filecontents = document.createElement("p");
// parent.appendChild(filecontents);
fileinput.addEventListener("change",(e)=>{
  	// filecontents.textContent = e.target.files[0].name;
  	console.log("file changed!");
	var fr = new FileReader();
	
	fr.addEventListener('load',() => {
		console.log("File reader loaded");
		var message = fr.result;
		var proxiesarray = message.split('\n');

		var proxiesbutton = document.querySelector("a[test-id='proxies']");
		proxiesbutton.addEventListener('click',async (e)=>{

			var addbutton = await waitForElm("a[href='#!/proxies/new']");
			
			addbutton.addEventListener('click',async (e)=>{
			    var [host,port,user,pwd] = proxiesarray[e.target.count].split(":")
				var evt = document.createEvent("HTMLEvents");
				evt.initEvent("change", false, true);

				var title = await waitForElm("input[data-testid='title']");
				title.value = "proxy"+String(e.target.count+1); 
				title.dispatchEvent(evt);

				var HOST = await waitForElm("input[data-testid='host']");
				HOST.value = host; 
				HOST.dispatchEvent(evt);

				var PORT = await waitForElm("input[data-testid='port']");
				PORT.value = port; 
				PORT.dispatchEvent(evt);

				var USERNAME = await waitForElm("input[data-testid='username']");
				USERNAME.value = user; 
				USERNAME.dispatchEvent(evt);

				var PASSWORD = await waitForElm("input[data-testid='password']");
				PASSWORD.value = pwd; 
				PASSWORD.dispatchEvent(evt);

				var protocol = await waitForElm("select.input__field");
				protocol.selectedIndex=2;
				protocol.dispatchEvent(evt);

				var SAVE = await waitForElm("button[data-testid='save']");
				SAVE.click();   
			})
			
			setTimeout(function(){
	                console.log("Prevent race condition");
	          },500);
			var oldcontainers = document.querySelectorAll("button.delete");
	        for (let i = 0; i< oldcontainers.length;i++){
	            setTimeout(function(){
	                console.log("deleting old proxy "+String(i+1));
	                oldcontainers[0].click();
	          },500*(i+2));
	        }
	        for (let i = 0; i< proxiesarray.length;i++){
			  	setTimeout(function(){
					console.log("adding proxy "+String(i+1));
				addbutton.count = i;
			    addbutton.click();
			  },500*(oldcontainers.length+i)+500*(i+1));
			}
		},{once:true})
		proxiesbutton.click();

	})
	fr.readAsText(e.target.files[0]);
}) 
