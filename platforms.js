// Platform definitions and URL builders for each used vehicle search site

// Marketplace aggregators
const MARKETPLACE_PLATFORMS = [
  {
    id: "autotrader",
    name: "AutoTrader",
    description: "One of the largest used car marketplaces with dealer and private listings.",
    color: "#e04e14",
    letter: "AT",
    badge: "Dealer + Private",
    buildUrl(f) {
      let url = "https://www.autotrader.com/cars-for-sale/used-cars";
      if (f.make) url += `/${encodeSlug(f.make)}`;
      if (f.model) url += `/${encodeSlug(f.model)}`;
      const params = new URLSearchParams();
      if (f.zipCode) params.set("zip", f.zipCode);
      if (f.radius) params.set("searchRadius", f.radius);
      if (f.priceMin) params.set("startYear", f.yearMin);
      if (f.yearMin) params.set("startYear", f.yearMin);
      if (f.yearMax) params.set("endYear", f.yearMax);
      if (f.priceMin) params.set("minPrice", f.priceMin);
      if (f.priceMax) params.set("maxPrice", f.priceMax);
      if (f.mileageMax) params.set("maxMileage", f.mileageMax);
      if (f.transmission === "automatic") params.set("transmissionCodes", "AUT");
      if (f.transmission === "manual") params.set("transmissionCodes", "MAN");
      if (f.fuelType === "electric") params.set("fuelTypeGroup", "ELE");
      if (f.fuelType === "hybrid") params.set("fuelTypeGroup", "HYB");
      if (f.drivetrain === "awd") params.set("driveGroup", "AWD4WD");
      if (f.drivetrain === "fwd") params.set("driveGroup", "FWD");
      if (f.drivetrain === "rwd") params.set("driveGroup", "RWD");
      if (f.color) params.set("extColorsSimple", f.color.toUpperCase());
      const sortMap = { price_low: "derivedpriceDESC", price_high: "derivedpriceASC", mileage_low: "mileageASC", year_new: "yearDESC", year_old: "yearASC", distance: "distanceASC" };
      if (sortMap[f.sortBy]) params.set("sortBy", sortMap[f.sortBy]);
      const qs = params.toString();
      return qs ? `${url}?${qs}` : url;
    }
  },
  {
    id: "cargurus",
    name: "CarGurus",
    description: "Price analysis and deal ratings on used vehicles from dealers nationwide.",
    color: "#6c28d2",
    letter: "CG",
    badge: "Deal Ratings",
    buildUrl(f) {
      const params = new URLSearchParams();
      params.set("sourceContext", "usedCarsSearch");
      params.set("inventorySearchWidgetType", "AUTO");
      if (f.make) params.set("makeIds", "");
      if (f.zipCode) params.set("zip", f.zipCode);
      if (f.radius) params.set("distance", f.radius);
      if (f.priceMin) params.set("minPrice", f.priceMin);
      if (f.priceMax) params.set("maxPrice", f.priceMax);
      if (f.mileageMax) params.set("maxMileage", f.mileageMax);
      if (f.yearMin) params.set("minYear", f.yearMin);
      if (f.yearMax) params.set("maxYear", f.yearMax);
      // CarGurus uses text search for make/model
      let searchText = "";
      if (f.make) searchText += f.make;
      if (f.model) searchText += " " + f.model;
      if (searchText) params.set("entitySelectionsString", searchText.trim());
      return `https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?${params.toString()}`;
    }
  },
  {
    id: "cars",
    name: "Cars.com",
    description: "Comprehensive listings with detailed vehicle history and reviews.",
    color: "#6d38e0",
    letter: "C",
    badge: "Reviews + History",
    buildUrl(f) {
      let url = "https://www.cars.com/shopping/results/";
      const params = new URLSearchParams();
      params.set("stock_type", "used");
      params.set("dealer_id", "");
      params.set("keyword", "");
      if (f.make) params.set("makes[]", encodeSlug(f.make).toLowerCase());
      if (f.model) params.set("models[]", `${encodeSlug(f.make).toLowerCase()}-${encodeSlug(f.model).toLowerCase()}`);
      if (f.yearMin) params.set("year_min", f.yearMin);
      if (f.yearMax) params.set("year_max", f.yearMax);
      if (f.priceMax) params.set("list_price_max", f.priceMax);
      if (f.priceMin) params.set("list_price_min", f.priceMin);
      if (f.mileageMax) params.set("maximum_distance", f.radius || "all");
      if (f.zipCode) params.set("zip", f.zipCode);
      if (f.mileageMax) params.set("mileage_max", f.mileageMax);
      if (f.transmission === "automatic") params.set("transmission_slugs[]", "automatic");
      if (f.transmission === "manual") params.set("transmission_slugs[]", "manual");
      if (f.fuelType) params.set("fuel_slugs[]", f.fuelType);
      if (f.drivetrain === "awd") params.set("drivetrain_slugs[]", "all_wheel_drive");
      if (f.drivetrain === "fwd") params.set("drivetrain_slugs[]", "front_wheel_drive");
      if (f.drivetrain === "rwd") params.set("drivetrain_slugs[]", "rear_wheel_drive");
      if (f.color) params.set("exterior_color_slugs[]", f.color);
      const sortMap = { price_low: "list_price", price_high: "list_price_desc", mileage_low: "mileage", year_new: "year_desc", year_old: "year", distance: "distance", best_match: "best_match_desc" };
      if (sortMap[f.sortBy]) params.set("sort", sortMap[f.sortBy]);
      return `${url}?${params.toString()}`;
    }
  },
  {
    id: "carfax",
    name: "Carfax",
    description: "Vehicle history reports and listings from Carfax-certified dealers.",
    color: "#0072ce",
    letter: "CF",
    badge: "History Reports",
    buildUrl(f) {
      const params = new URLSearchParams();
      if (f.make) params.set("make", f.make);
      if (f.model) params.set("model", f.model);
      if (f.yearMin) params.set("yearMin", f.yearMin);
      if (f.yearMax) params.set("yearMax", f.yearMax);
      if (f.priceMin) params.set("priceMin", f.priceMin);
      if (f.priceMax) params.set("priceMax", f.priceMax);
      if (f.mileageMax) params.set("mileageMax", f.mileageMax);
      if (f.zipCode) params.set("zip", f.zipCode);
      if (f.radius) params.set("radius", f.radius);
      if (f.color) params.set("color", f.color.charAt(0).toUpperCase() + f.color.slice(1));
      if (f.transmission === "automatic") params.set("transmission", "Automatic");
      if (f.transmission === "manual") params.set("transmission", "Manual");
      return `https://www.carfax.com/Used-Cars${params.toString() ? '?' + params.toString() : ''}`;
    }
  },
  {
    id: "edmunds",
    name: "Edmunds",
    description: "Expert reviews, true market value pricing, and used vehicle listings.",
    color: "#1a3c6e",
    letter: "Ed",
    badge: "Expert Reviews",
    buildUrl(f) {
      let path = "/inventory/srp.html";
      const params = new URLSearchParams();
      params.set("inventorytype", "used,cpo");
      if (f.make) params.set("make", f.make.toLowerCase());
      if (f.model) params.set("model", f.model.toLowerCase().replace(/\s+/g, "-"));
      if (f.yearMin) params.set("year", f.yearMin + (f.yearMax ? `-${f.yearMax}` : ""));
      if (f.priceMin) params.set("price", `${f.priceMin}-${f.priceMax || ""}`);
      else if (f.priceMax) params.set("price", `-${f.priceMax}`);
      if (f.mileageMax) params.set("mileage", f.mileageMax);
      if (f.zipCode) params.set("zip", f.zipCode);
      if (f.radius) params.set("radius", f.radius);
      return `https://www.edmunds.com${path}?${params.toString()}`;
    }
  },
  {
    id: "truecar",
    name: "TrueCar",
    description: "Transparent pricing with upfront price offers from certified dealers.",
    color: "#00b4d8",
    letter: "TC",
    badge: "Price Transparency",
    buildUrl(f) {
      let url = "https://www.truecar.com/used-cars-for-sale/listings/";
      const parts = [];
      if (f.make) parts.push(`make=${encodeSlug(f.make).toLowerCase()}/`);
      if (f.model) parts.push(`model=${encodeSlug(f.model).toLowerCase()}/`);
      if (f.yearMin || f.yearMax) parts.push(`year=${f.yearMin || ""}-${f.yearMax || ""}/`);
      if (f.priceMin || f.priceMax) parts.push(`price=${f.priceMin || ""}-${f.priceMax || ""}/`);
      if (f.mileageMax) parts.push(`mileage=${f.mileageMax}/`);
      url += parts.join("");
      const params = new URLSearchParams();
      if (f.zipCode) params.set("searchRadius", f.radius || "50");
      if (f.zipCode) params.set("zip", f.zipCode);
      const qs = params.toString();
      return qs ? `${url}?${qs}` : url;
    }
  },
  {
    id: "facebook",
    name: "Facebook Marketplace",
    description: "Local private-party vehicle listings from Facebook users near you.",
    color: "#1877f2",
    letter: "FB",
    badge: "Private Party",
    buildUrl(f) {
      let url = "https://www.facebook.com/marketplace/vehicles";
      const params = new URLSearchParams();
      params.set("exact", "false");
      if (f.make) params.set("make", f.make);
      if (f.model) params.set("model", f.model);
      if (f.yearMin) params.set("minYear", f.yearMin);
      if (f.yearMax) params.set("maxYear", f.yearMax);
      if (f.priceMin) params.set("minPrice", f.priceMin);
      if (f.priceMax) params.set("maxPrice", f.priceMax);
      if (f.mileageMax) params.set("maxMileage", f.mileageMax);
      if (f.transmission === "automatic") params.set("transmissionType", "automatic");
      if (f.transmission === "manual") params.set("transmissionType", "manual");
      return `${url}?${params.toString()}`;
    }
  },
  {
    id: "carvana",
    name: "Carvana",
    description: "Online-only dealer with home delivery and 7-day return policy.",
    color: "#00aed6",
    letter: "Cv",
    badge: "Home Delivery",
    buildUrl(f) {
      const filters = [];
      if (f.make) filters.push(`make=${encodeSlug(f.make)}`);
      if (f.model) filters.push(`model=${encodeSlug(f.model)}`);
      if (f.yearMin) filters.push(`year-min=${f.yearMin}`);
      if (f.yearMax) filters.push(`year-max=${f.yearMax}`);
      if (f.priceMin) filters.push(`price-min=${f.priceMin}`);
      if (f.priceMax) filters.push(`price-max=${f.priceMax}`);
      if (f.mileageMax) filters.push(`mileage-max=${f.mileageMax}`);
      return `https://www.carvana.com/cars${filters.length ? '?' + filters.join('&') : ''}`;
    }
  },
  {
    id: "craigslist",
    name: "Craigslist",
    description: "Classified ads with local private-party and dealer vehicle listings.",
    color: "#5a0e99",
    letter: "CL",
    badge: "Classifieds",
    buildUrl(f) {
      // Default to a generic search; user should go to local CL
      let base = "https://www.craigslist.org/search/cta";
      const params = new URLSearchParams();
      if (f.make) {
        let query = f.make;
        if (f.model) query += " " + f.model;
        params.set("query", query);
      }
      if (f.priceMin) params.set("min_price", f.priceMin);
      if (f.priceMax) params.set("max_price", f.priceMax);
      if (f.yearMin) params.set("min_auto_year", f.yearMin);
      if (f.yearMax) params.set("max_auto_year", f.yearMax);
      if (f.mileageMax) params.set("max_auto_miles", f.mileageMax);
      if (f.transmission === "automatic") params.set("auto_transmission", "1");
      if (f.transmission === "manual") params.set("auto_transmission", "2");
      const qs = params.toString();
      return qs ? `${base}?${qs}` : base;
    }
  },
  {
    id: "kbb",
    name: "Kelley Blue Book",
    description: "Trusted vehicle valuations and certified pre-owned listings.",
    color: "#003c71",
    letter: "KBB",
    badge: "Valuations",
    buildUrl(f) {
      let url = "https://www.kbb.com/cars-for-sale/used";
      if (f.make) url += `/${encodeSlug(f.make).toLowerCase()}`;
      if (f.model) url += `/${encodeSlug(f.model).toLowerCase()}`;
      url += "/";
      const params = new URLSearchParams();
      if (f.zipCode) params.set("zip", f.zipCode);
      if (f.radius) params.set("searchRadius", f.radius);
      if (f.yearMin) params.set("startYear", f.yearMin);
      if (f.yearMax) params.set("endYear", f.yearMax);
      if (f.priceMin) params.set("minPrice", f.priceMin);
      if (f.priceMax) params.set("maxPrice", f.priceMax);
      if (f.mileageMax) params.set("maxMileage", f.mileageMax);
      const qs = params.toString();
      return qs ? `${url}?${qs}` : url;
    }
  }
];

// Manufacturer / Dealership CPO & Pre-Owned sites
const DEALER_PLATFORMS = [
  {
    id: "toyota_cpo",
    name: "Toyota Certified Pre-Owned",
    description: "Factory-backed CPO vehicles with 12-mo/12K-mi comprehensive warranty.",
    color: "#eb0a1e",
    letter: "T",
    badge: "Manufacturer CPO",
    buildUrl(f) {
      let url = "https://www.toyotacertified.com/inventory";
      const params = new URLSearchParams();
      if (f.model) params.set("model", f.model);
      if (f.yearMin) params.set("yearMin", f.yearMin);
      if (f.yearMax) params.set("yearMax", f.yearMax);
      if (f.priceMax) params.set("priceMax", f.priceMax);
      if (f.priceMin) params.set("priceMin", f.priceMin);
      if (f.mileageMax) params.set("mileageMax", f.mileageMax);
      if (f.zipCode) params.set("zipCode", f.zipCode);
      if (f.radius) params.set("radius", f.radius);
      const qs = params.toString();
      return qs ? `${url}?${qs}` : url;
    }
  },
  {
    id: "honda_cpo",
    name: "Honda Certified Pre-Owned",
    description: "Honda CPO with 182-point inspection and 7-year/100K-mi powertrain warranty.",
    color: "#cc0000",
    letter: "H",
    badge: "Manufacturer CPO",
    buildUrl(f) {
      let url = "https://www.honda.com/certified-pre-owned/inventory";
      const params = new URLSearchParams();
      if (f.model) params.set("model", f.model);
      if (f.zipCode) params.set("zip", f.zipCode);
      if (f.radius) params.set("radius", f.radius);
      if (f.yearMin) params.set("yearMin", f.yearMin);
      if (f.yearMax) params.set("yearMax", f.yearMax);
      if (f.priceMax) params.set("priceMax", f.priceMax);
      const qs = params.toString();
      return qs ? `${url}?${qs}` : url;
    }
  },
  {
    id: "ford_cpo",
    name: "Ford Blue Advantage",
    description: "Ford certified and pre-owned vehicles with warranty coverage.",
    color: "#003478",
    letter: "F",
    badge: "Manufacturer CPO",
    buildUrl(f) {
      let url = "https://www.ford.com/buy/certified-pre-owned/";
      const params = new URLSearchParams();
      if (f.model) params.set("model", f.model);
      if (f.zipCode) params.set("zipcode", f.zipCode);
      if (f.radius) params.set("radius", f.radius);
      if (f.yearMin) params.set("yearMin", f.yearMin);
      if (f.yearMax) params.set("yearMax", f.yearMax);
      if (f.priceMax) params.set("priceMax", f.priceMax);
      const qs = params.toString();
      return qs ? `${url}?${qs}` : url;
    }
  },
  {
    id: "chevy_cpo",
    name: "Chevrolet Certified Pre-Owned",
    description: "GM CPO with 6-year/100K-mi powertrain limited warranty.",
    color: "#c8a54e",
    letter: "Ch",
    badge: "Manufacturer CPO",
    buildUrl(f) {
      let url = "https://www.chevrolet.com/certified-pre-owned/inventory";
      const params = new URLSearchParams();
      if (f.model) params.set("model", f.model);
      if (f.zipCode) params.set("zip", f.zipCode);
      if (f.radius) params.set("radius", f.radius);
      if (f.priceMax) params.set("priceMax", f.priceMax);
      const qs = params.toString();
      return qs ? `${url}?${qs}` : url;
    }
  },
  {
    id: "bmw_cpo",
    name: "BMW Certified Pre-Owned",
    description: "BMW CPO with unlimited mileage warranty for 1 year from purchase.",
    color: "#1c69d4",
    letter: "B",
    badge: "Manufacturer CPO",
    buildUrl(f) {
      let url = "https://www.bmwusa.com/certified-pre-owned.html";
      const params = new URLSearchParams();
      if (f.model) params.set("model", f.model);
      if (f.zipCode) params.set("zipCode", f.zipCode);
      if (f.radius) params.set("radius", f.radius);
      const qs = params.toString();
      return qs ? `${url}?${qs}` : url;
    }
  },
  {
    id: "mbenz_cpo",
    name: "Mercedes-Benz Certified Pre-Owned",
    description: "MB CPO with unlimited mileage warranty for 1 year after original warranty.",
    color: "#333333",
    letter: "MB",
    badge: "Manufacturer CPO",
    buildUrl(f) {
      let url = "https://www.mbusa.com/en/cpo/search";
      const params = new URLSearchParams();
      if (f.model) params.set("model", f.model);
      if (f.zipCode) params.set("zip", f.zipCode);
      if (f.radius) params.set("radius", f.radius);
      if (f.yearMin) params.set("yearMin", f.yearMin);
      if (f.yearMax) params.set("yearMax", f.yearMax);
      if (f.priceMax) params.set("priceMax", f.priceMax);
      const qs = params.toString();
      return qs ? `${url}?${qs}` : url;
    }
  },
  {
    id: "audi_cpo",
    name: "Audi Certified Pre-Owned",
    description: "Audi CPO with 300+ point inspection and limited warranty extension.",
    color: "#bb0a30",
    letter: "Au",
    badge: "Manufacturer CPO",
    buildUrl(f) {
      let url = "https://www.audiusa.com/us/web/en/shopping-tools/certified-pre-owned.html";
      const params = new URLSearchParams();
      if (f.zipCode) params.set("zip", f.zipCode);
      if (f.radius) params.set("radius", f.radius);
      const qs = params.toString();
      return qs ? `${url}?${qs}` : url;
    }
  },
  {
    id: "lexus_cpo",
    name: "Lexus Certified Pre-Owned",
    description: "Lexus L/Certified with 3-year unlimited-mileage warranty from purchase.",
    color: "#1a1a1a",
    letter: "L",
    badge: "Manufacturer CPO",
    buildUrl(f) {
      let url = "https://www.lexus.com/lcertified/inventory";
      const params = new URLSearchParams();
      if (f.model) params.set("model", f.model);
      if (f.zipCode) params.set("zip", f.zipCode);
      if (f.radius) params.set("radius", f.radius);
      const qs = params.toString();
      return qs ? `${url}?${qs}` : url;
    }
  },
  {
    id: "hyundai_cpo",
    name: "Hyundai Certified Pre-Owned",
    description: "Hyundai CPO with 10-year/100K-mi powertrain warranty from original date.",
    color: "#002c5f",
    letter: "Hy",
    badge: "Manufacturer CPO",
    buildUrl(f) {
      let url = "https://www.hyundaiusa.com/us/en/certified-pre-owned/inventory";
      const params = new URLSearchParams();
      if (f.model) params.set("model", f.model);
      if (f.zipCode) params.set("zip", f.zipCode);
      if (f.radius) params.set("radius", f.radius);
      const qs = params.toString();
      return qs ? `${url}?${qs}` : url;
    }
  },
  {
    id: "subaru_cpo",
    name: "Subaru Certified Pre-Owned",
    description: "Subaru CPO with 7-year/100K-mi powertrain coverage and 152-point inspection.",
    color: "#013c8a",
    letter: "Su",
    badge: "Manufacturer CPO",
    buildUrl(f) {
      let url = "https://www.subaru.com/vehicles/certified-pre-owned/inventory.html";
      const params = new URLSearchParams();
      if (f.model) params.set("model", f.model);
      if (f.zipCode) params.set("zip", f.zipCode);
      if (f.radius) params.set("distance", f.radius);
      const qs = params.toString();
      return qs ? `${url}?${qs}` : url;
    }
  },
  {
    id: "nissan_cpo",
    name: "Nissan Certified Pre-Owned",
    description: "Nissan CPO with 7-year/100K-mi powertrain limited warranty.",
    color: "#c3002f",
    letter: "N",
    badge: "Manufacturer CPO",
    buildUrl(f) {
      let url = "https://www.nissanusa.com/shopping-tools/certified-pre-owned/inventory.html";
      const params = new URLSearchParams();
      if (f.model) params.set("model", f.model);
      if (f.zipCode) params.set("zip", f.zipCode);
      if (f.radius) params.set("radius", f.radius);
      const qs = params.toString();
      return qs ? `${url}?${qs}` : url;
    }
  },
  {
    id: "kia_cpo",
    name: "Kia Certified Pre-Owned",
    description: "Kia CPO with 10-year/100K-mi limited powertrain warranty.",
    color: "#05141f",
    letter: "Ki",
    badge: "Manufacturer CPO",
    buildUrl(f) {
      let url = "https://www.kia.com/us/en/certified-pre-owned/inventory";
      const params = new URLSearchParams();
      if (f.model) params.set("model", f.model);
      if (f.zipCode) params.set("zip", f.zipCode);
      if (f.radius) params.set("radius", f.radius);
      const qs = params.toString();
      return qs ? `${url}?${qs}` : url;
    }
  },
  {
    id: "jeep_cpo",
    name: "Jeep Certified Pre-Owned",
    description: "Jeep CPO with 125-point inspection and 7-year/100K-mi powertrain warranty.",
    color: "#3a5a40",
    letter: "Jp",
    badge: "Manufacturer CPO",
    buildUrl(f) {
      let url = "https://www.jeep.com/certified-pre-owned.html";
      const params = new URLSearchParams();
      if (f.model) params.set("model", f.model);
      if (f.zipCode) params.set("zip", f.zipCode);
      if (f.radius) params.set("radius", f.radius);
      const qs = params.toString();
      return qs ? `${url}?${qs}` : url;
    }
  },
  {
    id: "vw_cpo",
    name: "Volkswagen Certified Pre-Owned",
    description: "VW CPO with 2-year/unlimited-mile bumper-to-bumper limited warranty.",
    color: "#001e50",
    letter: "VW",
    badge: "Manufacturer CPO",
    buildUrl(f) {
      let url = "https://www.vw.com/en/certified-pre-owned/inventory";
      const params = new URLSearchParams();
      if (f.model) params.set("model", f.model);
      if (f.zipCode) params.set("zip", f.zipCode);
      if (f.radius) params.set("radius", f.radius);
      const qs = params.toString();
      return qs ? `${url}?${qs}` : url;
    }
  },
  {
    id: "mazda_cpo",
    name: "Mazda Certified Pre-Owned",
    description: "Mazda CPO with 12-mo/12K-mi limited powertrain warranty.",
    color: "#910000",
    letter: "Mz",
    badge: "Manufacturer CPO",
    buildUrl(f) {
      let url = "https://www.mazdausa.com/shopping-tools/certified-pre-owned";
      const params = new URLSearchParams();
      if (f.model) params.set("model", f.model);
      if (f.zipCode) params.set("zip", f.zipCode);
      if (f.radius) params.set("radius", f.radius);
      const qs = params.toString();
      return qs ? `${url}?${qs}` : url;
    }
  },
  {
    id: "tesla_used",
    name: "Tesla Pre-Owned",
    description: "Official Tesla used inventory direct from Tesla with remaining warranty.",
    color: "#cc0000",
    letter: "Te",
    badge: "Direct from OEM",
    buildUrl(f) {
      let url = "https://www.tesla.com/inventory/used/m";
      const params = new URLSearchParams();
      if (f.zipCode) params.set("zip", f.zipCode);
      if (f.radius) params.set("range", f.radius);
      const qs = params.toString();
      return qs ? `${url}?${qs}` : url;
    }
  },
  {
    id: "porsche_cpo",
    name: "Porsche Approved CPO",
    description: "Porsche Approved CPO with 2-year unlimited-mileage warranty.",
    color: "#8c8c8c",
    letter: "P",
    badge: "Manufacturer CPO",
    buildUrl(f) {
      let url = "https://finder.porsche.com/us/en-US/search";
      const params = new URLSearchParams();
      params.set("condition", "used");
      if (f.model) params.set("model", f.model);
      if (f.zipCode) params.set("zip", f.zipCode);
      if (f.radius) params.set("radius", f.radius);
      const qs = params.toString();
      return `${url}?${qs}`;
    }
  }
];

// Combined list for easy iteration
const PLATFORMS = [...MARKETPLACE_PLATFORMS, ...DEALER_PLATFORMS];

function encodeSlug(str) {
  return str.replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}
