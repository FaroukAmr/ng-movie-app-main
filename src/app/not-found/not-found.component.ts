import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
})
export class NotFoundComponent {
  displayedUrl: string = '';
  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private titleService: Title
  ) {}
  ngOnInit() {
    this.route.url.subscribe((urlSegments) => {
      const requestedUrl = urlSegments.map((segment) => segment.path).join('/');

      this.displayedUrl = requestedUrl;
      this.titleService.setTitle(this.translate.instant('notFound404'));

      this.translate.onLangChange.subscribe(() => {
        this.titleService.setTitle(this.translate.instant('notFound404'));
      });
    });
  }
}
