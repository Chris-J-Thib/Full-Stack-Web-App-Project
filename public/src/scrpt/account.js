function checkStatus(){
    if(sessionStorage.getItem('id')==null) window.location.replace("/");
}

function logout(){
    sessionStorage.removeItem('id');
    window.location.replace("/")
}

function login(){
    window.location.href = "login.html"
}

async function addCourse(course){
    let msg = document.querySelectorAll(`label[for='${course}']`);
    let req = `?num=${course.slice(4)}&code=${course.slice(0,4)}`;

    

    const courseRes = await fetch("/courses/" + req);
    const courseJSON = await courseRes.json();

    console.log(JSON.stringify(courseJSON[0]));

    

    const res = await fetch(`/account/${sessionStorage.getItem('id')}/courses/add`, {
                                                method: 'PATCH',
                                                headers: {'Content-Type': 'application/json'},
                                                body: JSON.stringify(courseJSON[0])});
    const data = await res.json();

    console.log(data);

    if(data.error){
        msg[0].innerText = data.error;
    } else {
        msg[0].innerText = 'Successfully Added!';
    }
        
}