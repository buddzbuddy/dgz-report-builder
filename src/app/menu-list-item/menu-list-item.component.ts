import {Component, HostBinding, Input, OnInit, AfterViewInit} from '@angular/core';
import {MenuItem} from '../nav-item';
import {Router, NavigationEnd} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { NavService } from '../nav.service';

@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class MenuListItemComponent implements OnInit {
  expanded: boolean = false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() menuItem: MenuItem;
  @Input() depth: number;
  constructor(
    public navService: NavService,
    public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit() {
    this.initMenu();
  }
  initMenu(){
    this.navService.currentUrl.subscribe((url: string) => {
      if (this.menuItem.Route && url) {
        // console.log(`Checking '/${this.menuItem.Route}' against '${url}'`);
        this.expanded = url.indexOf(`/${this.menuItem.Route}`) === 0;
        this.ariaExpanded = this.expanded;
        // console.log(`${this.item.route} is expanded: ${this.expanded}`);
      }
    });
  }
  onItemSelected(menuItem: MenuItem) {
    if (!menuItem.MenuItems || !menuItem.MenuItems.length) {
      this.router.navigate([menuItem.Route]);
      //this.navService.closeNav();
    }
    if (menuItem.MenuItems && menuItem.MenuItems.length) {
      this.expanded = !this.expanded;
      //this.router.navigate([menuItem.Route]);
    }
  }
}
