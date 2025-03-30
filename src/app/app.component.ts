import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { interval, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  unsubscribe$ = new Subject();
  targetDate = new Date('2025-04-27T06:35:59');
  randomPhotosAmount: number = 10;
  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;

  allPhotos = [
    'https://i.pinimg.com/736x/7f/df/78/7fdf7846ffc9a27febb3cb22f34a6e78.jpg',
    'https://i.pinimg.com/736x/db/09/cb/db09cb66cdaf5290214d56da3164984c.jpg',
    'https://i.pinimg.com/736x/28/e7/2a/28e72a6634ad6590de1afc7c7d497c9a.jpg',
    'https://i.pinimg.com/736x/0b/b5/0c/0bb50cab56aa072231ca44ebaefa3751.jpg',
    'https://i.pinimg.com/736x/51/f4/6c/51f46cebb054d89197a691b5d0995dd3.jpg',
    'https://i.pinimg.com/736x/06/bb/57/06bb571e2a301e80c7e1c4d85791bb82.jpg',
    'https://i.pinimg.com/736x/b7/ac/b7/b7acb7f545ab7fd45e52c1ee34cd713e.jpg',
    'https://i.pinimg.com/736x/24/4e/9c/244e9c02accb1d4bb36360b84c60f26f.jpg',
    'https://i.pinimg.com/736x/fe/f3/4c/fef34c051f0b5839e04f9189ea4ae5cb.jpg',
    'https://i.pinimg.com/736x/b0/2f/23/b02f23c46cc9435ad999bff0ac91b21e.jpg',
    'https://i.pinimg.com/736x/87/b4/fb/87b4fba79fb62a0e3ef8b7884ef2ab82.jpg',
    'https://i.pinimg.com/736x/32/a4/e9/32a4e9260cd346e4b34190e2ac9f6b5b.jpg',
    'https://i.pinimg.com/736x/cf/71/5d/cf715d1a42d6f457b5efea3b136abb81.jpg',
    'https://i.pinimg.com/736x/6c/f0/ed/6cf0edeebfd545924aaace979dbfa95d.jpg',
    'https://i.pinimg.com/736x/0c/61/88/0c618813f07f3dd54957af35483017ae.jpg',
    'https://i.pinimg.com/736x/6a/9f/a9/6a9fa9fae1aba625efdb55e5bba8de05.jpg',
    'https://i.pinimg.com/736x/fe/38/2a/fe382abdb9bf88a4b7c6e2fbbd0db99d.jpg',
    'https://i.pinimg.com/736x/fc/6c/4b/fc6c4b91f4921cbe280ca0e8b3c477eb.jpg',
    'https://i.pinimg.com/736x/7f/8e/6e/7f8e6e76a20e5b5961fd87c11dcc8b5a.jpg',
    'https://i.pinimg.com/736x/bb/e9/4e/bbe94e5ba2565813ecd4260b79b1babf.jpg',
    'https://i.pinimg.com/736x/9e/1f/1f/9e1f1fe8bd2d8788b2cc41261948e2d2.jpg',
    'https://i.pinimg.com/736x/75/5a/80/755a806c2aeb3c2ebef544881569aabc.jpg',
    'https://i.pinimg.com/736x/da/e5/88/dae588738d20d5bec00f2ef65f22b029.jpg',
    'https://i.pinimg.com/736x/0b/87/75/0b87756515b3855a93d89aebdc6f8001.jpg',
    'https://i.pinimg.com/736x/c5/b3/67/c5b36740351760270c80e50acf272578.jpg',
    'https://i.pinimg.com/736x/10/02/8b/10028b77acf9d89ceb6f848cfefe544f.jpg',
    'https://i.pinimg.com/736x/21/ef/7e/21ef7ea910deb653d83c6cbfe20a5e20.jpg',
  ];
  photos: string[] = [];

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.updateCountdown();
    interval(1000).pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.updateCountdown());
  }

  ngAfterViewInit() {
    this.photos = this.getRandomPhotos(this.randomPhotosAmount);
    this.positionPhotos();
  }

  updateCountdown() {
    const now = new Date();
    const diff = this.targetDate.getTime() - now.getTime();

    if (diff > 0) {
      this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      this.minutes = Math.floor((diff / (1000 * 60)) % 60);
      this.seconds = Math.floor((diff / 1000) % 60);
    } else {
      this.days = this.hours = this.minutes = 0;
    }
  }

  positionPhotos() {
    const container = this.el.nativeElement.querySelector('.container');
    const photoGrid = this.el.nativeElement.querySelector('.photo-grid');
    const timerBox = this.el.nativeElement.querySelector('.timer');
    const timerRect = timerBox.getBoundingClientRect();

    this.photos.forEach((photoSrc) => {
      const imgBox = this.renderer.createElement('div');
      this.renderer.addClass(imgBox, 'photo-box');
      const img = this.renderer.createElement('img');
      img.src = photoSrc;
      this.renderer.appendChild(imgBox, img);
      this.renderer.appendChild(photoGrid, imgBox);

      let top, left, overlap, attempts = 0;
      const maxAttempts = 50;
      do {
        top = Math.random() * (container.clientHeight - 150);
        left = Math.random() * (container.clientWidth - 150);
        overlap = this.checkOverlap(photoGrid, top, left, timerRect);
        attempts++;
      } while (overlap && attempts < maxAttempts);

      if (attempts < maxAttempts) {
        this.renderer.setStyle(imgBox, 'top', `${top}px`);
        this.renderer.setStyle(imgBox, 'left', `${left}px`);
      }
    });
  }

  getRandomPhotos(count: number): string[] {
    return this.allPhotos.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  checkOverlap(photoGrid: HTMLElement, top: number, left: number, timerRect: DOMRect): boolean {
    const photos = Array.from(photoGrid.children) as HTMLElement[];
    for (let photo of photos) {
      const rect = photo.getBoundingClientRect();
      const overlapX = Math.max(0, Math.min(rect.right, left + 250) - Math.max(rect.left, left));
      const overlapY = Math.max(0, Math.min(rect.bottom, top + 250) - Math.max(rect.top, top));
      if ((overlapX * overlapY) / (250 * 250) > 0.1) {
        return true;
      }
    }
    return (
      left < timerRect.right &&
      left + 250 > timerRect.left &&
      top < timerRect.bottom &&
      top + 250 > timerRect.top
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
