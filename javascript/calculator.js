
var forms = [];
var Assignment = {
    totalNumberOfSections: 0,
    totalAssignmentPoints: 0,
    sections: [{
        totalSectionPercentage: 0,
        totalSectionRubricPoints: 0,
    }]
};
var studentAssignment = {
    sections: [{
        RubricPointsEarned: 0
    }],
    totalPercentageEarned: 0,
    totalNumberOfPointsEarned: 0
}


document.addEventListener("DOMContentLoaded", function() {
    setup2();
    SetupForms(forms);
});


var studentForm = {
    form: null,
    submitTarget: null,
    resetTarget: null,
    reset: function() {
        this.form.querySelectorAll("input[type='number']").forEach((input) => {
            input.value = 0;
        });
        studentAssignment.sections = [];
        studentAssignment.totalPercentageEarned = 0;
        studentAssignment.totalPercentageEarned = 0;
        var results = document.querySelector('#totalScore').innerHTML = 0;
    },
    settings: {"preventDefault": true, "stopPropagation": true },
    evaluate: function() {
        var formIsCorrect = true;
        
        var inputs = this.form.querySelectorAll("input[type='number']");
        for (let i =0; i < inputs.length; i++){
            if (parseInt(inputs[i].value) < 0 ) {
                formIsCorrect = false;
                alert("Percentage Input cannot be 0.")
                inputs[i].className = inputs[i].className.includes("error") ? inputs[i].className : inputs[i].className + " error";
            } else if (parseInt(inputs[i].value) > Assignment.sections[i].totalSectionRubricPoints) {
                formIsCorrect = false;
                alert("Input cannot be greater than section total ruberic points. \n\nEX) if section says (out of 5) then you cannot have a number greater than 5. \n\n As a reminder the score is how many ruberic points the student get correct.")
                inputs[i].className = inputs[i].className.includes("error") ? inputs[i].className : inputs[i].className + " error";
            } else {
                inputs[i].className = inputs[i].className.replace(/\s+error/, "");
            }
        }

        return formIsCorrect;
    },
    submit: function() {
        studentAssignment.sections = [];
        this.form.querySelectorAll("input[type='number']").forEach((section) => {
            studentAssignment.sections.push({
                RubricPointsEarned: section.value
            });
        });

        var results = document.querySelector('#totalScore');
        var pointsEarned = document.querySelector("#totalPoints");
        var totalPercentage = 0;
        for (let i = 0; i < studentAssignment.sections.length; i++) {
            totalPercentage = totalPercentage + studentAssignment.sections[i].RubricPointsEarned*(Assignment.sections[i].totalSectionPercentage/Assignment.sections[i].totalSectionRubricPoints);
        }
        var totalPointsEarned = (totalPercentage / 100) * Assignment.totalAssignmentPoints;
        results.innerHTML = totalPercentage;
        pointsEarned.innerHTML = totalPointsEarned;
        studentAssignment.totalPointsEarned= totalPointsEarned;
        studentAssignment.totalPercentageEarned = totalPercentage;
    }
};

var PercentageForm = {
    form: null,
    submitTarget: null,
    resetTarget: null,
    reset: null,
    settings: {"preventDefault": true, "stopPropagation": true },
    evaluate: function() {
        var formIsCorrect = true;
        this.form.querySelectorAll("input[type='number']").forEach((input) => {
            if (input.value == 0 ) {
                formIsCorrect = false;
                alert("Percentage Input cannot be 0.")
                input.className = input.className.includes("error") ? input.className : input.className + " error";
            } else {
                input.className = input.className.replace(/\s+error/, "");
            }
        });

        return formIsCorrect;
    },
    submit: function() {
        Assignment.sections = [];
        this.form.querySelectorAll("div.section").forEach((section) => {
            Assignment.sections.push({
                totalSectionPercentage: section.querySelector(".percentage").value,
                totalSectionRubricPoints: section.querySelector(".ruberic").value,
            });
        });

        var formTemplate = document.createElement("div");
        formTemplate.id="studentScore";
        formTemplate.innerHTML = document.querySelector('template.studentScore').innerHTML;
        
        var sectionTemplate = formTemplate.querySelector("div.section");

        formTemplate.querySelector("div.section").remove();


        for (var i = 0; i < Assignment.totalNumberOfSections; i++) {
            
            var tempSectionTemplate = document.createElement("div");
            tempSectionTemplate.className = "section section-" + i;
            tempSectionTemplate.innerHTML = sectionTemplate.innerHTML;

            tempSectionTemplate.querySelector("p").innerHTML = "Score for section " + (i+1) + " (out of " + Assignment.sections[i].totalSectionRubricPoints + "):";
            tempSectionTemplate.querySelector('input').setAttribute("name", "section"+i);
            tempSectionTemplate.querySelector('input').className = "section"+i;
            formTemplate.querySelector("form").insertBefore(tempSectionTemplate, formTemplate.querySelector("input[type='submit']"));
        }


        formTemplate.querySelector("#pointsPossible").innerHTML = Assignment.totalAssignmentPoints;
        studentForm.form = formTemplate.querySelector("form");
        studentForm.submitTarget = formTemplate.querySelector("form input[type='submit']");
        studentForm.resetTarget = formTemplate.querySelector(".reset");

        this.form.style="display:none";
        document.querySelector(".base_parent").insertBefore(formTemplate, document.querySelector(".base"));

        document.querySelector(".resetAll").addEventListener("click", function() {
            document.location.reload();
        });

        SetupForms([studentForm]);
    }
};


var SectionForm = {
    form: null,
    submitTarget: null,
    resetTarget: null,
    settings: {"preventDefault": true, "stopPropagation": true },
    reset: function() {
        this.form.querySelectorAll("input[type='number']").forEach((input) => {
            input.value = 0;
        });
    },
    submit: function() {
        Assignment.totalNumberOfSections = this.form.querySelector('.NumberOfSections').value;
        Assignment.totalAssignmentPoints = this.form.querySelector('.TotalAssignmentPoints').value;

        var formTemplate = document.createElement("div");
        formTemplate.id="PercentageCalculator";
        formTemplate.innerHTML = document.querySelector('template.sectionsPercentage').innerHTML;
        
        var sectionTemplate = formTemplate.querySelector("div.section");

        formTemplate.querySelector("div.section").remove();


        for (var i = 0; i < Assignment.totalNumberOfSections; i++) {
            
            var tempSectionTemplate = document.createElement("div");
            tempSectionTemplate.className = "section section-" + i;
            tempSectionTemplate.innerHTML = sectionTemplate.innerHTML;

            tempSectionTemplate.querySelector("span.sectionPercentage").innerHTML = "What Percentage is Section " + (i+1) + " worth?";
            tempSectionTemplate.querySelector("span.sectionRuberic").innerHTML = "How many Ruberic Points does Section " + (i+1) + " have?";
            formTemplate.querySelector("form").insertBefore(tempSectionTemplate, formTemplate.querySelector("input[type='submit']"));
        }


        PercentageForm.form = formTemplate.querySelector("form");
        PercentageForm.submitTarget = formTemplate.querySelector("form input[type='submit']");

        this.form.style="display:none";
        document.querySelector(".base_parent").insertBefore(formTemplate, document.querySelector(".base"));

        SetupForms([PercentageForm]);
    },
    evaluate: function() {
        var formIsCorrect = true;
        this.form.querySelectorAll("input[type='number']").forEach((input) => {
            if (input.value == 0 ) {
                formIsCorrect = false;
                alert("Input cannot be 0.")
                input.className = input.className.includes("error") ? input.className : input.className + " error";
            } else {
                input.className = input.className.replace(/\s+error/, "");
            }
        });

        return formIsCorrect;
    }
};

function SetupForms(formsList) {
    formsList.forEach((form) => {
        if (form.submit != null) {
            form.submitTarget.addEventListener("click", (e) => { 

                if(form.settings.preventDefault) {
                    e.preventDefault();
                }
                if (form.settings.stopPropagation) {
                    e.stopPropagation();
                }
    
                if (form.evaluate && form.evaluate() == false){
                    //do nothing
                } else {
                    form.submit();
                }
            });
        }
       
        if (form.reset != null) {
            form.resetTarget.addEventListener("click", (e) => { 

                if(form.settings.preventDefault) {
                    e.preventDefault();
                }
                if (form.settings.stopPropagation) {
                    e.stopPropagation();
                }
    
                form.reset();
            });
        }
    });
}

function setup2(){
    SectionForm.form = document.querySelector("#numberOfSections");
    SectionForm.submitTarget = document.querySelector("#numberOfSections input[type='submit']");
    SectionForm.resetTarget = document.querySelector("#numberOfSections .reset")

    forms.push(SectionForm);
}