import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { UtilityService } from 'src/app/services/utility.service';
import { URL_ROUTES } from '@constant/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(
    private router: Router,
  ) {
    this.router.navigateByUrl(URL_ROUTES.STORE_HOME);
  }

  ngOnInit(): void {
  }

}
