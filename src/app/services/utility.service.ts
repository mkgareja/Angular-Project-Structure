import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Injectable({
    providedIn: 'root'
})
export class UtilityService {

    constructor(
        private spinner: NgxSpinnerService,
        private translate: TranslateService,
        private toastr: ToastrService,
    ) { }

    public getQueryParams = new BehaviorSubject(null);
    public getCarouselData = new BehaviorSubject(null);

    static MatchPassword(control: AbstractControl) {
        const password = control.get('password').value;
        const confirmPassword = control.get('confirmpassword').value;
        if (password !== confirmPassword) {
            control.get('confirmpassword').setErrors({ ConfirmPassword: true });
        }
        else {
            return false;
        }
    }
    showLoading() {
        this.spinner.show();
    }

    hideLoading() {
        this.spinner.hide();
    }
    camelCase(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    showSuccessToast(msg) {
        this.toastr.success(msg, null, {
            positionClass: 'toast-top-center',
        });
    }

    showErrorToast(msg) {
        this.showErrorMessagePositionChange(msg);
    }

    showInfoToast(msg) {
        this.toastr.info(msg);
    }

    buildQuery(data) {
        if (typeof (data) === 'string') { return data; }
        const query = [];
        for (const key in data) {
            if (data.hasOwnProperty(key) && encodeURIComponent(data[key])) {
                query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
            }
        }
        return query.join('&');
    }

    downloadFile(data, fileName) {
        const urlBlob = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = urlBlob;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    totalHoursCalculation(timeMap) {
        let totalH = 0;
        let totalM = 0;
        for (const x of timeMap) {
            totalH += +x.estimatedHour;
            totalM += +x.estimatedMinutes;
        }
        if (totalM >= 60) {
            totalH += Math.floor(totalM / 60);
            totalM = totalM % 60;
        }
        return `${totalH}.${totalM} hours`;
    }

    getListSort(array) {
        const nameArray = [];
        let subString = '';
        let fullString = '';
        if (array.length > 0) {
            array.forEach((accessModule) => {
                nameArray.push(accessModule.name || accessModule.serviceName);
            });
        }
        if (array.length > 2) {
            fullString = nameArray.join(',\n');
            subString = nameArray.slice(0, 2).join(', ');
            subString += `, + ${nameArray.length - 2} more`;
        } else {
            fullString = nameArray.join('\n');
            subString = nameArray.join(', ');
        }
        return { subString, fullString };
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    cleanObject(obj) {
        for (const propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined || !obj[propName]) {
                delete obj[propName];
            }
        }
        return obj;
    }

    convertArabicToEnglish(str) {
        let e = '۰'.charCodeAt(0);
        str = str.replace(/[۰-۹]/g, (t) => {
            return t.charCodeAt(0) - e;
        });
        e = '٠'.charCodeAt(0);
        str = str.replace(/[٠-٩]/g, (t) => {
            return t.charCodeAt(0) - e;
        });
        return str;
    }

    showErrorMessagePositionChange(msg) {
        this.toastr.warning(msg, null, {
            toastClass: 'msg',
            positionClass: 'toast-top-center',
        });
    }
}
