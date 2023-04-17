function checkStatus(){
    if(sessionStorage.getItem('id')==null) window.location.replace("/");
    else {

        load(1);
    } 
}

function logout(){
    sessionStorage.removeItem('id');
    window.location.replace("/")
}

function login(){
    window.location.href = "login.html"
}

async function setReg(course, state){
    let msg = document.querySelectorAll(`label[for='${course}']`);
    let req = `?num=${course.slice(4)}&code=${course.slice(0,4)}`;
    let type,notify;

    if(state == 'add'){
        type = 'add';
        notify = 'Successfully Added.'
    } else {
        type = 'remove';
        notify = 'Successfully Removed.'
    } 

    const courseRes = await fetch("/courses/" + req);
    const courseJSON = await courseRes.json();

    const res = await fetch(`/account/${sessionStorage.getItem('id')}/courses/`+type, {
                                                method: 'PATCH',
                                                headers: {'Content-Type': 'application/json'},
                                                body: JSON.stringify(courseJSON[0])});
    const data = await res.json();

    if(data.error) msg[0].innerText = data.error;
    else msg[0].innerText = notify;

    if(state == 'remove'){
        main.removeChild(document.getElementById("courseList"));
        load(0);
    }
}

async function load(first){

    let main = document.getElementById('main');
    let courses = document.createElement('div');

    courses.id = 'courseList';

    const res = await fetch(`/account/${sessionStorage.getItem('id')}`);
    const data = await res.json();

    if(first){
        let user = document.getElementById('user');
        user.innerText = data.user.username;
    }

    data.user.courses.forEach(element => {
        let course = document.createElement('div');        
        let but = document.createElement('button');
        let lab = document.createElement('label');
        course.className = 'course';
        lab.setAttribute('for', element['code']+element['num']);
        but.innerText = "Remove";
        but.id = element['code']+element['num'];
        but.setAttribute('onclick', `setReg("${element['code']+element['num']}", "remove")`);
        but.className = 'remove';
        for (const key in element) {
            if(key == 'credits') continue;
            value = element[key];
            if(key == 'name') value = '-'+'\xa0'.repeat(2) + value;
            let div = document.createElement('div');
            div.className = key;
            div.innerText = value;
            course.appendChild(div);
        }
        course.appendChild(but);
        course.appendChild(lab);
        courses.appendChild(course);
    });
    main.appendChild(courses);
    
}