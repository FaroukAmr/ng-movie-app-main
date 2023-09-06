import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
})
export class NotFoundComponent {
  displayedUrl: string = '';
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.url.subscribe((urlSegments) => {
      const requestedUrl = urlSegments.map((segment) => segment.path).join('/');

      this.displayedUrl = requestedUrl;
    });
  }
}
