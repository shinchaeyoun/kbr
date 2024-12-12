(function (win, $) {

    win.main = {
        quiz_list: [
            'choice',
            'input',
            'lineToLine'
        ],

        async page_init(predata) {
            const p = main;

            console.log(predata,p);
        },//ok
        Main_class: class Main_class {
            constructor (){
                this.main_type = 'choice'
            }
        },
        Class_manager: class Class_manager {
            constructor(_args) {
                this.quiz_type = _args.main_type;
            };
        }
    };

    win.main.CHOICE = class CHOICE extends win.main.Class_manager {
        constructor(_args) {
            super(_args);
            this.init(_args)
        }
        init() {
            console.log('choice main')
        };
    };

    
})(window, jQuery);

const mainInstance = new window.main.Main_class();
const choiceInstance = new main.CHOICE(mainInstance);