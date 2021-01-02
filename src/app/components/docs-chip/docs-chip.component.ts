import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'docs-chip',
  templateUrl: './docs-chip.component.html',
  styleUrls: ['./docs-chip.component.scss'],
  host: {
    '[class.docs-chip-radius--circle]': `radius==='circle'`,
    '[class.docs-chip-radius--round]': `radius==='round'`,
    '[class.docs-chip-type--parameter]': `type==='parameter'`,
    '[class.docs-chip-type--property-name]': `type==='property-name'`,
    '[class.docs-chip-type--method-name]': `type==='method-name'`,
    '[class.docs-chip-type--return-type]': `type==='return-type'`,
    '[class.docs-chip-type--type]': `type==='type'`,
    '[class.docs-chip-type--name]': `type==='name'`,
    '[class.docs-chip-type--link]': `type==='link'`,
  }
})
export class DocsChipComponent implements OnInit {
  @Input() radius: undefined | 'circle' | 'round';
  @Input() type: 'parameter' | 'property-name' | 'method-name' | 'return-type' | 'type' | 'name'|'link';
  constructor() {}

  ngOnInit() {}
}
