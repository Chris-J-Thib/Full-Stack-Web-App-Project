async function getCourseList(req){
    let main = document.getElementById('main');
    let log = document.getElementById('logbut');
    let courses = document.createElement('div');
    let acc = document.getElementById('acc');
    let add;

    loaded = false;
    courses.id = 'courseList';

    if(document.getElementById('courseList')) main.removeChild(document.getElementById('courseList'));

    if(req) link = "/courses/" + req;
    else link = "/courses";

    if (sessionStorage.getItem("id") != null) {
        add = true;
        acc.setAttribute('onclick', "window.location.href='./account.html'");
        acc.innerText = 'Account';
        log.innerText = "Logout";
        log.setAttribute('onclick', 'logout()');
    } else {
        add = false;
        acc.setAttribute('onclick', "window.location.href='./signup.html'");
        acc.innerText = 'Signup';
        log.innerText = "Login";
        log.setAttribute('onclick', 'login()');
    }
    
    const res = await fetch(link);
    const data = await res.json();
    


    if(!document.getElementById('code')){
        let opts = new Set();
        data.forEach(e => {
            opts.add(e.code);
        });
        select = document.getElementById('pre-code');
        select.id = 'code';
        opts.forEach(e => {
            let opt = document.createElement('option');
            opt.value = e;
            opt.text = e;
            select.appendChild(opt);
        });
    }

    

    

    data.forEach(element => {
        let course = document.createElement('div');        
        let but = document.createElement('button');
        let lab = document.createElement('label');
        course.className = 'course';
        lab.setAttribute('for', element['code']+element['num']);
        but.innerText = "Add";
        but.id = element['code']+element['num'];
        but.setAttribute('onclick', `setReg("${element['code']+element['num']}","add")`);
        but.className = 'add';
        for (const key in element) {
            if(key == 'credits') continue;
            value = element[key];
            if(key == 'name') value = '-'+'\xa0'.repeat(2) + value;
            let div = document.createElement('div');
            div.className = key;
            div.innerText = value;
            course.appendChild(div);
        }
        if(sessionStorage.getItem("id") != null) {
            course.appendChild(but);
            course.appendChild(lab);
        }
        courses.appendChild(course);
    });
    main.appendChild(courses);
}

async function filter(){
    let num = document.getElementById('num').value;
    let code = document.getElementById('code').value;
    let req = `?num=${num}&code=${code}`;
    getCourseList(req);
}