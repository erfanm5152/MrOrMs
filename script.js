// در ابتدا تمام عناصر مورد نیاز صفحه را در متغییر هایی قرار میدهیم.
const name = document.getElementById('name')
const submit_button = document.getElementById('submit-button')
const save_button = document.getElementById('save-button')
const clear_button = document.getElementById('clear-button')
const result_prediction = document.getElementById('result-prediction')
const result_likelihood = document.getElementById('result-likelihood')
const result_saved = document.getElementById('result-saved')
const radio_buttons_male = document.getElementById('radioMale')
const radio_buttons_female = document.getElementById('radioFemale')
const radio_buttons = document.getElementById('radio-buttons')
const localStorage = window.localStorage
const load_label = document.getElementById("load")
const error_box = document.getElementById("error")

// با استفاده از تابع زیر هنگام تغییر تکست، نتایج را خالی میکنیم.
function empty_fields(event) {
    result_prediction.innerHTML = "Gender";
    result_likelihood.innerHTML = "Likelihood";
    result_saved.innerHTML = "Saved Gender";
}
// از تابع زیر برای نمایش ارور در ارور باکس استفاده میشود.
function showError(error){
    error_box.style.visibility = "visible"
    error_box.innerHTML= error + "<br> Click on me to go"
}
// از تابع زیر برای درخواست زدن به api مورد نظر و دریافت نتایج استفاده میشود.
function get_result(){
    load_label.style.visibility = "visible"
    fetch("https://api.genderize.io/?name=" + name.value).then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok, " + response.status);
        }
        return response.json();
    }).then(
        (data) => {
            if (data['gender'] === null) {
                throw new Error("This name does not exist");
            }
            result_prediction.innerHTML = data['gender'][0].toUpperCase() + data['gender'].slice(1);
            result_likelihood.innerHTML = data['probability'];
        }
    ).catch((error) => {
        showError(error);
    })
    load_label.style.visibility = 'hidden';
}
// در بخش زیر روی کلید های فشرده شده توسط کاربر event listener اضافه میشود تا فقط حروف و فاصله وارد شود.
name.addEventListener('keydown', function (event) {
    let key = event.key;
    let regex = /[^a-zA-Z\s]+/;
    if (regex.test(key) && key !== 'Backspace' && key !== 'Delete' && key !== 'ArrowLeft' && key !== 'ArrowRight') {
        console.log(key);
        event.preventDefault();
    }
})
// برای خالی شدن نتایح هنگام تغییر ورودی است
name.addEventListener('keydown', empty_fields);
// در بخش زیر عملکرد دکمه تایید تعریف میشود
submit_button.addEventListener('click', function (event) {
    let save = localStorage.getItem(name.value);
    result_saved.innerHTML = save === null ? "Not Saved" : save;
    get_result();
    event.preventDefault();
});
// در بخش زیر نیز عملکرد دکمه
save_button.addEventListener("click", function (event) {
    // event.preventDefault()
    // console.log(radio_buttons_female)
    let value;
    if (name.value === ""){
        showError(Error("You have not entered a name"))
        event.preventDefault();
        return;
    }
    if (radio_buttons_male.checked) {
        value = radio_buttons_male.value;
    } else if (radio_buttons_female.checked) {
        value = radio_buttons_female.value;
    } else {
        showError("One of the radio buttons must be selected.")
        event.preventDefault();
        return;
    }
    localStorage.setItem(name.value , value);
    result_saved.innerHTML = value;
    get_result();
    event.preventDefault();
})
// در بخش زیر نیز عملیات مربوط به حذف یک نتیجه از local storage پیاده سازی شده است
clear_button.addEventListener("click",function (event){
    localStorage.removeItem(name.value);
    result_saved.innerHTML="Removed";
})
// بخش زیر نیز برای از بین رفتن error box استفاده شده است.
error_box.addEventListener("click",function (event){
    error_box.style.visibility = 'hidden';
    event.stopPropagation()
});
