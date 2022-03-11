const axios = require('axios');
const qs = require('query-string');
axios.defaults.baseURL = 'https://toschool.in/toschoolsource/php/';

const getdata = async (url, sUrl, data = {}) => (await axios.post(url, JSON.stringify({
    "tbYear": "2564",
    "tbTerm": "2",
    "sUrl": sUrl,
    ...data
}))).data;

(async () => {
    const students = await getdata("/getdata/get_student.php", "49/110/245/1428/1972/666/4255/396/6760/1110/11211/216/475/784/749/690/693/")
    const scoringreport = await getdata("/getdata/get_ScoringReport.php", "57/106/275/1456/1972/666/4255/396/6760/1110/11211/216/475/784/749/690/693/")
    const get_student = (name) => students.filter(_ => name.includes(_.Sname) || name.includes(_.Slname))
    const student = get_student("ผิวสว่าง")[0]
    const subjects = await getdata("/getdata/get_subject.php", "57/106/275/1456/1972/666/4255/396/6760/1110/11211/216/475/784/749/690/693/", {
        "tbSclass": student.Sclass,
    })
    const user_scoring = scoringreport.filter(_ => _.Gstudent_id == student.SID)
    let total_unit = 0
    let for_cal_gpa = 0
    const get_subject = (code) => subjects.find(_ => _.Jcode == code)
    let grade_report = []
    user_scoring.forEach(_ => {
        const unit = parseFloat(get_subject(_.Gsubject_code).Junit)
        total_unit += unit
        for_cal_gpa += unit * (parseFloat(_.Ggrade)||4)
        grade_report.push({
            name: get_subject(_.Gsubject_code).Jname,
            grade: _.Ggrade
        })
    })
    const res = {
        full_name: [student.Sname, student.Slname].join(" "),
        subjects: grade_report,
        total_unit,
        gpa: (for_cal_gpa / total_unit).toFixed(2)
    }
    console.log(res);
})()