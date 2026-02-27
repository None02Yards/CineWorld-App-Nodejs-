import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-main-cine-intro',
  templateUrl: './main-cine-intro.component.html',
  styleUrls: ['./main-cine-intro.component.scss']
})
export class MainCineIntroComponent implements OnInit {

  @Output() finished = new EventEmitter<void>();
  play = false;

  ngOnInit(): void {
    requestAnimationFrame(() => this.play = true);

    setTimeout(() => {
      this.finished.emit();
    }, 2500); // must match CSS animation duration
  }
}