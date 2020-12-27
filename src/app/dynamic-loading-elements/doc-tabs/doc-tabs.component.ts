import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { inputPropertyChange } from '../../utils/input-property-change';
import { StoreService } from '../../store/store.service';
import { ElementInputPropertyStore } from '../../store/class/element-input.store';
import { elementInputPropertySelector } from '../../store/selector/element-input.selector';

@Component({
  selector: 'doc-tabs',
  templateUrl: './doc-tabs.component.html',
  styleUrls: ['./doc-tabs.component.scss'],
})
export class DocTabsComponent implements OnInit {
  @Input() index;
  @Input() list: { title: string; url: string; selected: boolean }[] = [];

  constructor(private storeService: StoreService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (inputPropertyChange(changes.index, this.index)) {
      this.storeService
        .select(ElementInputPropertyStore)
        .pipe(elementInputPropertySelector(this.index))
        .subscribe((property) => {
          this.list = property;
        });
    }
  }
}
