import { Injectable, OnDestroy } from '@angular/core';
import { Log } from 'ng2-logger';

import { Bid } from '../api/bid/bid.model';
import { MarketStateService } from 'app/core/market/market-state/market-state.service';
import { Listing } from 'app/core/market/api/listing/listing.model';

@Injectable()
export class AddToCartCacheService implements OnDestroy {

  private log: any = Log.create('add-to-cart-cache.service id:' + Math.floor((Math.random() * 1000) + 1));
  public orders: Array<any> = new Array();
  private destroyed: boolean = false;
  private isEnabled: boolean = false;

  constructor(
    private marketState: MarketStateService
  ) {}

  start() {
    this.isEnabled = true;

    this.update();
    // subscribe to changes
    this.getBids().takeWhile(() => !this.destroyed && this.isEnabled).subscribe(orders => {
      this.orders = orders;
    });
  }

  stop() {
    this.isEnabled = false;
  }

  isBidded(listing: Listing): boolean {
    if (listing) {
      return this.orders.filter(order => order.ListingItem.hash)
                        .map(o => o.ListingItem.hash)
                        .includes(listing.hash);
    }
    return false;
  }

  update() {
    this.marketState.register('bid', null, ['search', 0, 9999, 'ASC'])
  }

  getBids() {
    return this.marketState.observe('bid');
  }

  ngOnDestroy() {
    this.destroyed = true;
  }

}
