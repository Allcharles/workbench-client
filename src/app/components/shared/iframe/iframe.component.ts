import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { assetRoot } from "@services/app-config/app-config.service";
import { interval } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "baw-iframe",
  template: `
    <iframe #content [src]="url" (load)="updateIframeSize()"></iframe>
  `,
  styles: [
    `
      iframe {
        width: 100%;
        min-height: 100%;
        border: 0px;
      }
    `,
  ],
})
export class IFrameComponent extends withUnsubscribe() implements OnInit {
  @ViewChild("content") private iframeRef: ElementRef<HTMLIFrameElement>;
  public url: SafeResourceUrl;
  /** Used to track the height of the iframe */
  private previousHeight = 0;

  public constructor(private router: Router, private sanitizer: DomSanitizer) {
    super();
  }

  public ngOnInit() {
    // Transform the url into the format required by AngularJS
    const requestedUrl = assetRoot + "/old-client/#" + this.router.url;
    // Bypass angular default security
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(requestedUrl);

    // Update iframe size every 250 milliseconds
    interval(250)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.updateIframeSize();
      });
  }

  public updateIframeSize() {
    const iframe = this.iframeRef?.nativeElement;
    const currentHeight = iframe?.contentDocument?.body?.scrollHeight;

    // If iframe has not been built, current height is not available, or no change in size
    if (!iframe || !currentHeight || currentHeight === this.previousHeight) {
      return;
    }

    const padding = 50;
    this.previousHeight = currentHeight;
    iframe.style.height = currentHeight + padding + "px";
  }
}
