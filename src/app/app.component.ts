import { Component, OnDestroy, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private translate: TranslateService) {}

  ngOnInit() {}

  onHandleError() {}

  ngOnDestroy() {}
}
