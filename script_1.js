
async function closeBidding(closeBidding) {  // eslint-disable-line no-unused-vars
    const listing = closeBidding.listing;
    if (listing.state !== 'OPEN') {         //Write something instead for_sale
        throw new Error('Tender is not open for bidding');
    }
    // by default we mark the listing as RESERVE_NOT_MET
    listing.state = 'RESERVE_NOT_MET';
    let lowestOffer = null;
    let contractor = null;                       //Contractor
    let department = null;                      //Department
    if (listing.offers && listing.offers.length > 0) {
        // sort the bids by bidPrice
        listing.offers.sort(function(a, b) {
            return (a.bidPrice - b.bidPrice);
        });
        lowestOffer = listing.offers[0];
        if (lowestOffer.bidPrice <= listing.reservePrice) {
            // mark the listing as CLOSED
            listing.state = 'CLOSED';
            contractor = lowestOffer.member;
            department = listing.vehicle.owner;
            // update the balance of the department
            console.log('#### department balance before: ' + department.balance);
            department.balance += lowestOffer.bidPrice;
            console.log('#### department balance after: ' + department.balance);
            //update the balance of the contractor
            console.log('#### contractor balance before: ' + contractor.balance);
            contractor.balance -= lowestOffer.bidPrice;
            console.log('#### contractor balance after: ' + contractor.balance);
            //transfer the vehicle to the contractor
            listing.vehicle.owner = contractor;
            // clear the offers
            listing.offers = null;
        }
    }

    if (lowestOffer) {
        // save the vehicle
        const vehicleRegistry = await getAssetRegistry('org.acme.vehicle.auction.Vehicle');
        await vehicleRegistry.update(listing.vehicle);
    }

    // save the vehicle listing
    const vehicleListingRegistry = await getAssetRegistry('org.acme.vehicle.auction.VehicleListing');
    await vehicleListingRegistry.update(listing);

    if (listing.state === 'CLOSED') {
        // save the buyer
        const userRegistry = await getParticipantRegistry('org.acme.vehicle.auction.Member');
        await userRegistry.updateAll([contractor, department]);
    }
}

/**
 * Make an Offer for a VehicleListing
 * @param {org.acme.vehicle.auction.Offer} offer - the offer
 * @transaction
 */
async function makeOffer(offer) {  // eslint-disable-line no-unused-vars
    let listing = offer.listing;
    if (listing.state !== 'OPEN') {
        throw new Error('Tender is not open for bidding');
    }
    if (!listing.offers) {
        listing.offers = [];
    }
    listing.offers.push(offer);

    // save the vehicle listing
    const vehicleListingRegistry = await getAssetRegistry('org.acme.vehicle.auction.VehicleListing');
    await vehicleListingRegistry.update(listing);
}