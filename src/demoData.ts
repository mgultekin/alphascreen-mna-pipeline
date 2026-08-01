// AUTO-CAPTURED DEMO DATA — real output from a live food-retail screening run.
// Lets visitors explore the full UI instantly, without a Gemini API key.
// Regenerate by running a screen and saving the streamed results here.
import { ScreeningResult } from './types';

export const DEMO_RESULTS: ScreeningResult[] = [
  {
    "ticker": "UNFI",
    "companyName": "United Natural Foods, Inc.",
    "sector": "Consumer Defensive",
    "industry": "Food Distribution",
    "marketCapB": 3.07,
    "ebitdaMargin": 1.8,
    "peRatio": 15.8,
    "revGrowthPct": -4.2,
    "score": "-",
    "findings": "Screened out: EBITDA Margin (1.8%) below 5% minimum",
    "decision": "âšª SCREENED OUT",
    "rawProfile": "United Natural Foods, Inc., together with its subsidiaries, engages in the distribution of natural, organic, specialty, produce, and conventional grocery and non-food products in the United States and Canada. It operates in three segments: Natural, Wholesale, and Retail. The company distributes grocery and general merchandise, perishables, frozen food, wellness and personal care items, bulk and foodservice, home, health and beauty care, pharmacy, pet food, produce, meat, d…",
    "dataSources": [
      "Yahoo Finance"
    ]
  },
  {
    "ticker": "SFM",
    "companyName": "Sprouts Farmers Market, Inc.",
    "sector": "Consumer Defensive",
    "industry": "Grocery Stores",
    "marketCapB": 7.52,
    "ebitdaMargin": 9.4,
    "peRatio": 13.6,
    "revGrowthPct": 4.1,
    "score": 8,
    "findings": "Sprouts Farmers Market operates as a mid-cap food retailer with a market capitalization of $7.52B, offering strong margins with an EBITDA margin of 9.4% and $3,416M in gross profit on $8,806M in revenue. The company sells fresh, natural, and organic products under its proprietary Sprouts brand, fulfilling private label criteria. However, specific details regarding technology adoption, automation, or e-commerce are not explicitly detailed in the provided data.",
    "riskFactors": "Revenue growth remains relatively low at 4.1%, posing potential growth limitations in a competitive grocery market.",
    "growthDrivers": "Expanding market share through its proprietary Sprouts brand and capitalizing on consumer demand for natural, organic, and lifestyle-friendly food products.",
    "decision": "ðŸŸ¢ DEEP DIVE",
    "rawProfile": "Sprouts Farmers Market, Inc., together with its subsidiaries, engages in the retailing of fresh, natural, and organic food products in the United States. The company offers healthy grocery stores; and lifestyle-friendly ingredients such as organic, plant-based, keto, paleo, non-GMO, and gluten-free. The company also offers perishable product categories, including produce, meat and meat alternatives, seafood, deli, bakery, floral, and dairy alternatives; and non-perishable …",
    "secData": {
      "cik": "0001575515",
      "recentFilings": [
        {
          "form": "10-Q",
          "filingDate": "2026-04-29",
          "description": "10-Q"
        },
        {
          "form": "10-K",
          "filingDate": "2026-02-19",
          "description": "10-K"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-10-29",
          "description": "10-Q"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-07-30",
          "description": "10-Q"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-04-30",
          "description": "10-Q"
        }
      ],
      "xbrlFacts": {
        "revenue": 8806159000,
        "netIncome": 523670000,
        "totalAssets": 4158649000,
        "grossProfit": 3416389000,
        "operatingIncome": 686158000,
        "stockholdersEquity": 1403074000
      }
    },
    "dataSources": [
      "Yahoo Finance",
      "SEC EDGAR",
      "Gemini AI"
    ]
  },
  {
    "ticker": "KR",
    "companyName": "The Kroger Co.",
    "sector": "Consumer Defensive",
    "industry": "Grocery Stores",
    "marketCapB": 36.95,
    "ebitdaMargin": 5.4,
    "peRatio": 10.9,
    "revGrowthPct": 2.2,
    "score": 4,
    "findings": "The Kroger Co. is a large-cap grocery retailer with a $36.95B market cap and $147.64B in revenue, placing it well outside the targeted mid-cap scope. While it maintains e-commerce capabilities via online platforms and in-house manufacturing, its financial profile exhibits modest EBITDA margins of 5.4% and revenue growth of 2.2%. These factors result in a weak overall fit for a mid-cap, high-margin strategic acquisition.",
    "riskFactors": "Risks include low EBITDA margins of 5.4% and stagnant top-line revenue growth of 2.2%. Additionally, its $36.95B market cap represents a massive transaction size unsuitable for mid-cap consolidation strategy.",
    "growthDrivers": "Growth potential rests on scaling its online platform sales and expanding its proprietary food manufacturing and processing operations. Broad reach across its multi-department, marketplace, and price impact warehouse store formats provides nationwide market presence.",
    "decision": "ðŸ”´ DISCARD",
    "rawProfile": "The Kroger Co. operates as a food and drug retailer in the United States. The company operates combination food and drug stores, multi-department stores, marketplace stores, and price impact warehouses. Its combination food and drug stores offer natural food and organic sections, pharmacies, general merchandise, pet centers, fresh seafood, and organic produce; and its multi-department stores provide apparel, home fashion and furnishings, outdoor living, electronics, automo…",
    "secData": {
      "cik": "0000056873",
      "recentFilings": [
        {
          "form": "10-Q",
          "filingDate": "2026-06-26",
          "description": "10-Q"
        },
        {
          "form": "10-K",
          "filingDate": "2026-03-31",
          "description": "10-K"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-12-12",
          "description": "10-Q"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-09-19",
          "description": "10-Q"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-06-27",
          "description": "10-Q"
        }
      ],
      "xbrlFacts": {
        "revenue": 147642000000,
        "netIncome": 1016000000,
        "totalAssets": 49953000000,
        "operatingIncome": 1890000000,
        "stockholdersEquity": 5927000000
      }
    },
    "dataSources": [
      "Yahoo Finance",
      "SEC EDGAR",
      "Gemini AI"
    ]
  },
  {
    "ticker": "ACI",
    "companyName": "Albertsons Companies, Inc.",
    "sector": "Consumer Defensive",
    "industry": "Grocery Stores",
    "marketCapB": 5.93,
    "ebitdaMargin": 4.3,
    "peRatio": 6.5,
    "revGrowthPct": 0,
    "score": "-",
    "findings": "Screened out: EBITDA Margin (4.3%) below 5% minimum",
    "decision": "âšª SCREENED OUT",
    "rawProfile": "Albertsons Companies, Inc., through its subsidiaries, operates in the food and drug retail industry in the United States. The company's food and drug retail stores offer grocery products, general merchandise, health and beauty care products, pharmacy, vaccines, fuel, and other items and services. It also operates stores under various banners, including Albertsons, Safeway, Vons, Pavilions, Randalls, Tom Thumb, Carrs, Jewel-Osco, ACME, Shaw's, Star Market, United Supermarke…",
    "dataSources": [
      "Yahoo Finance"
    ]
  },
  {
    "ticker": "GO",
    "companyName": "Grocery Outlet Holding Corp.",
    "sector": "Consumer Defensive",
    "industry": "Grocery Stores",
    "marketCapB": 0.91,
    "ebitdaMargin": 4.4,
    "peRatio": 14.6,
    "revGrowthPct": 3.6,
    "score": "-",
    "findings": "Screened out: EBITDA Margin (4.4%) below 5% minimum",
    "decision": "âšª SCREENED OUT",
    "rawProfile": "Grocery Outlet Holding Corp. operates as a retailer of consumables and fresh products sold through independently operated stores in the United States. It offers perishable department products, including dairy and deli; produce and floral; and meat and seafood. The company also provides non-perishable department products, such as non-perishable grocery, general merchandise, health and beauty care, frozen foods, and beer and wine. It operates stores in California, Washington…",
    "dataSources": [
      "Yahoo Finance"
    ]
  },
  {
    "ticker": "CASY",
    "companyName": "Casey's General Stores, Inc.",
    "sector": "Consumer Cyclical",
    "industry": "Specialty Retail",
    "marketCapB": 32.6,
    "ebitdaMargin": 8.5,
    "peRatio": 37.4,
    "revGrowthPct": 14.5,
    "score": "-",
    "findings": "Screened out: P/E Ratio (37.4) exceeds 30x maximum",
    "decision": "âšª SCREENED OUT",
    "rawProfile": "Casey's General Stores, Inc., together with its subsidiaries, operates convenience stores under the Casey's and Casey's General Store names in the United States. Its stores offer pizza, donuts, hot breakfast items, and sandwiches; and beverages, tobacco and nicotine products. The company's stores also provide soft drinks, energy, water, sports drinks, juices, coffee, and tea and dairy products; beer, wine, and spirits; snacks, candy, packaged bakery, and other food items; …",
    "dataSources": [
      "Yahoo Finance"
    ]
  },
  {
    "ticker": "CHEF",
    "companyName": "The Chefs' Warehouse, Inc.",
    "sector": "Consumer Defensive",
    "industry": "Food Distribution",
    "marketCapB": 4.54,
    "ebitdaMargin": 5.6,
    "peRatio": 41.4,
    "revGrowthPct": 11.4,
    "score": "-",
    "findings": "Screened out: P/E Ratio (41.4) exceeds 30x maximum",
    "decision": "âšª SCREENED OUT",
    "rawProfile": "The Chefs' Warehouse, Inc., together with its subsidiaries, distributes specialty food and center-of-the-plate products in the United States, the Middle East, and Canada. It offers specialty food products, such as artisan charcuterie, specialty cheeses, unique oils and vinegars, truffles, caviar, chocolate, and pastry products and center-of-the-plate products that includes custom cut beef, seafood, and hormone-free poultry, as well as produce and broadline food products co…",
    "dataSources": [
      "Yahoo Finance"
    ]
  },
  {
    "ticker": "PFGC",
    "companyName": "Performance Food Group Company",
    "sector": "Consumer Defensive",
    "industry": "Food Distribution",
    "marketCapB": 18.28,
    "ebitdaMargin": 2.6,
    "peRatio": 20.4,
    "revGrowthPct": 6.4,
    "score": "-",
    "findings": "Screened out: EBITDA Margin (2.6%) below 5% minimum",
    "decision": "âšª SCREENED OUT",
    "rawProfile": "Performance Food Group Company, through its subsidiaries, engages in the marketing and distribution of food and food-related products in North America. It operates through three segments: Foodservice, Convenience, and Specialty. The company offers beef, pork, poultry, and seafood; frozen food and refrigerated products; dry groceries comprising cleaning and kitchen supplies and disposables; candy, snacks, and beverages; and fresh products, groceries, dairy, bread, beverages…",
    "dataSources": [
      "Yahoo Finance"
    ]
  },
  {
    "ticker": "IMKTA",
    "companyName": "Ingles Markets, Incorporated",
    "sector": "Consumer Defensive",
    "industry": "Grocery Stores",
    "marketCapB": 1.72,
    "ebitdaMargin": 5,
    "peRatio": 19.3,
    "revGrowthPct": 3.4,
    "score": "-",
    "findings": "Screened out: EBITDA Margin (5.0%) below 5% minimum",
    "decision": "âšª SCREENED OUT",
    "rawProfile": "Ingles Markets, Incorporated, together with its subsidiaries, operates a chain of supermarkets in the United States. The company offers food products, such as grocery, meat, and dairy products, produce, frozen food, and other perishables; and non-food products, which include fuel centers, pharmacies, health and beauty care products, and general merchandise, as well as private label items, organic, and locally sourced items. It also owns and operates a milk processing and p…",
    "dataSources": [
      "Yahoo Finance"
    ]
  },
  {
    "ticker": "USFD",
    "companyName": "US Foods Holding Corp.",
    "sector": "Consumer Defensive",
    "industry": "Food Distribution",
    "marketCapB": 22.64,
    "ebitdaMargin": 4.3,
    "peRatio": 18.8,
    "revGrowthPct": 2.8,
    "score": "-",
    "findings": "Screened out: EBITDA Margin (4.3%) below 5% minimum",
    "decision": "âšª SCREENED OUT",
    "rawProfile": "US Foods Holding Corp., together with its subsidiaries, markets, sells, and distributes fresh, frozen, and dry food and non-food products to foodservice customers in the United States. The company also provides MOXe, an all-in-one foodservice business application. Its customers include independently owned single and multi-unit restaurants, regional concepts, national restaurant chains, hospitals, nursing homes, hotels and motels, country clubs, government and military orga…",
    "dataSources": [
      "Yahoo Finance"
    ]
  },
  {
    "ticker": "NGVC",
    "companyName": "Natural Grocers by Vitamin Cottage, Inc.",
    "sector": "Consumer Defensive",
    "industry": "Grocery Stores",
    "marketCapB": 0.75,
    "ebitdaMargin": 7.3,
    "peRatio": 14.2,
    "revGrowthPct": 0.5,
    "score": 4,
    "findings": "Natural Grocers features a strong private label presence across organic groceries and dietary supplements. However, with a market cap of $0.75B and sluggish revenue growth of 0.5%, it falls short of the target mid-cap scale and growth profile. Furthermore, the provided data lacks evidence of e-commerce capabilities, supply chain innovation, or technology and automation adoption.",
    "riskFactors": "Near-flat revenue growth of 0.5% presents significant top-line stagnation risk. Lack of documented e-commerce and automation initiatives may disadvantage the business against tech-enabled competitors.",
    "growthDrivers": "Expanding its extensive private label product catalog can continue to support gross profitability. Broader store footprint expansion from its Colorado base provides potential for incremental market capture.",
    "decision": "ðŸ”´ DISCARD",
    "rawProfile": "Natural Grocers by Vitamin Cottage, Inc., together with its subsidiaries, retails natural and organic groceries, and dietary supplements in the United States. The company's stores offer natural and organic grocery products, such as organic produce; private label repackaged bulk products, including dried fruits, nuts, grains, granolas, teas, herbs, and spices, as well as peanut and almond butters; private label products comprising grocery staples, household products, bulk f…",
    "secData": {
      "cik": "0001547459",
      "recentFilings": [
        {
          "form": "10-Q",
          "filingDate": "2026-05-07",
          "description": "FORM 10-Q"
        },
        {
          "form": "10-Q",
          "filingDate": "2026-02-05",
          "description": "FORM 10-Q"
        },
        {
          "form": "10-K",
          "filingDate": "2025-12-11",
          "description": "FORM 10-K"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-08-07",
          "description": "FORM 10-Q"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-05-08",
          "description": "FORM 10-Q"
        }
      ],
      "xbrlFacts": {
        "revenue": 274206000,
        "netIncome": 46444000,
        "totalAssets": 670504000,
        "grossProfit": 397877000,
        "operatingIncome": 61990000,
        "stockholdersEquity": 212395000
      }
    },
    "dataSources": [
      "Yahoo Finance",
      "SEC EDGAR",
      "Gemini AI"
    ]
  },
  {
    "ticker": "SYY",
    "companyName": "Sysco Corporation",
    "sector": "Consumer Defensive",
    "industry": "Food Distribution",
    "marketCapB": 40.94,
    "ebitdaMargin": 5.5,
    "peRatio": 17.3,
    "revGrowthPct": 4.7,
    "score": 4,
    "findings": "Sysco Corporation is a global food distribution company with $81.37 billion in revenue and a $40.94 billion market cap, placing it well outside the specified mid-cap target range. While it operates directly in food distribution with a 5.5% EBITDA margin, the provided data lacks explicit evidence of private label growth, technology adoption, or supply chain innovation. Consequently, it presents a weak strategic fit for the target mandate.",
    "riskFactors": "Sysco's large-cap scale with a $40.94 billion market cap makes it unsuitable for a mid-cap buyout focus. Additionally, its operating EBITDA margin is modest at 5.5%.",
    "growthDrivers": "Sysco demonstrates moderate top-line expansion with 4.7% revenue growth across international and domestic foodservice segments. It leverages an expansive product distribution footprint serving restaurants, educational facilities, healthcare institutions, and lodging venues.",
    "decision": "ðŸ”´ DISCARD",
    "rawProfile": "Sysco Corporation, through its subsidiaries, engages in the marketing and distribution of various food and related products to the foodservice or food-away-from-home industry in the United States, Canada, the United Kingdom, France, and internationally. It operates through U.S. Foodservice Operations, International Foodservice Operations, SYGMA, and Other segments. The company distributes frozen food, such as meat, seafood, fully prepared entrÃ©es, fruits, vegetables, and …",
    "secData": {
      "cik": "0000096021",
      "recentFilings": [
        {
          "form": "10-Q",
          "filingDate": "2026-04-29",
          "description": "10-Q"
        },
        {
          "form": "10-Q",
          "filingDate": "2026-01-28",
          "description": "10-Q"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-10-29",
          "description": "10-Q"
        },
        {
          "form": "10-K",
          "filingDate": "2025-08-22",
          "description": "10-K"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-04-30",
          "description": "10-Q"
        }
      ],
      "xbrlFacts": {
        "revenue": 81370000000,
        "netIncome": 1828000000,
        "totalAssets": 26774000000,
        "grossProfit": 14969000000,
        "operatingIncome": 3088000000,
        "stockholdersEquity": 1830000000
      }
    },
    "dataSources": [
      "Yahoo Finance",
      "SEC EDGAR",
      "Gemini AI"
    ]
  },
  {
    "ticker": "LANC",
    "companyName": "Lancaster Colony Corporation",
    "marketCapB": 0,
    "ebitdaMargin": 0,
    "revGrowthPct": 0,
    "score": "-",
    "findings": "Screened out: EBITDA Margin (0.0%) below 5% minimum",
    "decision": "âšª SCREENED OUT",
    "rawProfile": "No business summary available for LANC.",
    "dataSources": [
      "Yahoo Finance"
    ]
  },
  {
    "ticker": "HAIN",
    "companyName": "The Hain Celestial Group, Inc.",
    "sector": "Consumer Defensive",
    "industry": "Packaged Foods",
    "marketCapB": 0.04,
    "ebitdaMargin": 5.8,
    "peRatio": 4.8,
    "revGrowthPct": -13.3,
    "score": 2,
    "findings": "The Hain Celestial Group is a packaged foods manufacturer with a market cap of $0.04B, which fails to meet the target criteria for mid-cap food retail and distribution companies. The company demonstrates financial strain with revenue declining by 13.3%, an EBITDA margin of 5.8%, and an operating loss of $462M. Furthermore, the provided data shows no presence of private label growth, technology automation, or supply chain innovation.",
    "riskFactors": "Major risks include deep unprofitability with a net loss of $531M and ongoing top-line contraction. Low EBITDA margins leave little room for operational error or investment.",
    "growthDrivers": "Growth catalysts depend on its broad brand presence across organic products, teas, and personal care items. It leverages distribution across mass-market, specialty, and e-commerce retailers.",
    "decision": "ðŸ”´ DISCARD",
    "rawProfile": "The Hain Celestial Group, Inc. manufactures, markets, and sells organic and natural products in the United States, United Kingdom, Europe, and internationally. The company offers infant formula; infant and toddler formula, infant cereals, baby food pouches, snacks and frozen toddler and kids' foods; plant-based beverages such as soy, rice, oat, cashew and spelt; and condiments, as well as meat-free dishes and meals. It also provides cooking and culinary oils, vinegars, and…",
    "secData": {
      "cik": "0000910406",
      "recentFilings": [
        {
          "form": "10-Q",
          "filingDate": "2026-05-11",
          "description": "10-Q"
        },
        {
          "form": "10-Q",
          "filingDate": "2026-02-09",
          "description": "10-Q"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-11-07",
          "description": "10-Q"
        },
        {
          "form": "10-K",
          "filingDate": "2025-09-15",
          "description": "10-K"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-05-07",
          "description": "10-Q"
        }
      ],
      "xbrlFacts": {
        "revenue": 2457769000,
        "netIncome": -530841000,
        "totalAssets": 1603278000,
        "grossProfit": 334058000,
        "operatingIncome": -461603000,
        "stockholdersEquity": 475005000
      }
    },
    "dataSources": [
      "Yahoo Finance",
      "SEC EDGAR",
      "Gemini AI"
    ]
  },
  {
    "ticker": "WMK",
    "companyName": "Weis Markets, Inc.",
    "sector": "Consumer Defensive",
    "industry": "Grocery Stores",
    "marketCapB": 1.92,
    "ebitdaMargin": 5.1,
    "peRatio": 19.2,
    "revGrowthPct": 4.6,
    "score": 6,
    "findings": "Weis Markets fits the mid-cap food retail profile with a $1.92B market cap, $4.715B in revenue, and regional market presence across seven mid-Atlantic states. However, its EBITDA margin is modest at 5.1%, and the provided profile lacks evidence of supply chain innovation, e-commerce capabilities, technology adoption, or private label expansion.",
    "riskFactors": "A modest EBITDA margin of 5.1% offers limited downside protection, while the absence of documented technology, automation, or e-commerce capabilities presents a competitive risk.",
    "growthDrivers": "Existing regional footprint across seven states offers a foundation for local market consolidation. Baseline revenue growth of 4.6% demonstrates steady demand across grocery and retail services.",
    "decision": "ðŸ”´ DISCARD",
    "rawProfile": "Weis Markets, Inc. engages in the retail sale of food through a chain of supermarkets. The company's retail food stores offer groceries, dairy products, frozen food, meats, seafood, fresh produce, floral, pharmacy services, deli products, prepared food, bakery products, beer and wine, and fuel; and general merchandise items, such as health and beauty care, and household products. It also operates stores in Delaware, Maryland, New Jersey, New York, Pennsylvania, Virginia, a…",
    "secData": {
      "cik": "0000105418",
      "recentFilings": [
        {
          "form": "10-Q",
          "filingDate": "2026-05-07",
          "description": "10-Q"
        },
        {
          "form": "10-K",
          "filingDate": "2026-03-12",
          "description": "10-K"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-11-06",
          "description": "10-Q"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-08-07",
          "description": "10-Q"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-05-08",
          "description": "10-Q"
        }
      ],
      "xbrlFacts": {
        "revenue": 4714573000,
        "netIncome": 93691000,
        "totalAssets": 2027359000,
        "grossProfit": 1239863000,
        "operatingIncome": 113653000,
        "stockholdersEquity": 1351910000
      }
    },
    "dataSources": [
      "Yahoo Finance",
      "SEC EDGAR",
      "Gemini AI"
    ]
  },
  {
    "ticker": "JBSS",
    "companyName": "John B. Sanfilippo & Son, Inc.",
    "sector": "Consumer Defensive",
    "industry": "Packaged Foods",
    "marketCapB": 0.99,
    "ebitdaMargin": 10.4,
    "peRatio": 17.9,
    "revGrowthPct": 8,
    "score": 6,
    "findings": "John B. Sanfilippo & Son, Inc. operates as a mid-cap food distributor and processor with $1,107M in revenue, a 10.4% EBITDA margin, and established private brand offerings. However, the provided profile lacks evidence of technology and automation adoption, e-commerce capabilities, or supply chain innovation prioritized in the strategic criteria.",
    "riskFactors": "Risks include potential margin exposure in contract packaging and a lack of explicit documented e-commerce or automated technology infrastructure.",
    "growthDrivers": "Growth catalysts include ongoing expansion of private label products and an 8.0% revenue growth across its retail, wholesale, and ingredient channels.",
    "decision": "ðŸ”´ DISCARD",
    "rawProfile": "John B. Sanfilippo & Son, Inc., through its subsidiary, JBSS Ventures, LLC, processes and distributes tree nuts and peanuts in the United States. The company offers raw and processed nuts, including almonds, pecans, peanuts, black walnuts, English walnuts, cashews, macadamia nuts, pistachios, pine nuts, Brazil nuts, and filberts in various styles and seasonings; and bar product line, including chewy granola, fruit and grain, sweet and salty, dipped chewy granola, crunchy, …",
    "secData": {
      "cik": "0000880117",
      "recentFilings": [
        {
          "form": "10-Q",
          "filingDate": "2026-04-29",
          "description": "10-Q"
        },
        {
          "form": "10-Q",
          "filingDate": "2026-01-29",
          "description": "10-Q"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-10-29",
          "description": "10-Q"
        },
        {
          "form": "10-K",
          "filingDate": "2025-08-20",
          "description": "10-K"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-04-30",
          "description": "10-Q"
        }
      ],
      "xbrlFacts": {
        "revenue": 1107246000,
        "netIncome": 58934000,
        "totalAssets": 597603000,
        "grossProfit": 203471000,
        "operatingIncome": 84711000,
        "stockholdersEquity": 360697000
      }
    },
    "dataSources": [
      "Yahoo Finance",
      "SEC EDGAR",
      "Gemini AI"
    ]
  },
  {
    "ticker": "BGS",
    "companyName": "B&G Foods, Inc.",
    "sector": "Consumer Defensive",
    "industry": "Packaged Foods",
    "marketCapB": 0.31,
    "ebitdaMargin": 14.1,
    "peRatio": 6.7,
    "revGrowthPct": -3.9,
    "score": 3,
    "findings": "B&G Foods operates as a packaged foods manufacturer and distributor with $1.83B in revenue and a 14.1% EBITDA margin, but falls short of criteria with a small market cap ($0.31B), negative revenue growth (-3.9%), and a net loss of $-43M. The profile contains no evidence of required strategic criteria such as e-commerce capabilities, technology/automation adoption, supply chain innovation, or private label growth.",
    "riskFactors": "Key risks include ongoing top-line contraction with revenue growth at -3.9% and net unprofitability of $-43M. Furthermore, the company carries significant balance sheet risk with total assets of $2.835B against stockholders equity of $453M.",
    "growthDrivers": "Growth catalysts rely on leveraging its extensive portfolio of legacy brands like Crisco, Ortega, and Green Giant to drive market share. Expanding distribution across existing channels such as mass merchants, foodservice outlets, and warehouse clubs presents additional leverage.",
    "decision": "ðŸ”´ DISCARD",
    "rawProfile": "B&G Foods, Inc. manufactures, sells, and distributes a portfolio of shelf-stable and frozen foods, and household products in the United States, Canada, and Puerto Rico. It operates through Specialty, Meals, Frozen & Vegetables, and Spices & Flavor Solutions segments. The company offers frozen and canned vegetables, vegetables, canola and other cooking oils, vegetable shortening, cooking sprays, oatmeal and other hot cereals, fruit spreads, canned meats and beans, bagel chi…",
    "secData": {
      "cik": "0001278027",
      "recentFilings": [
        {
          "form": "10-Q",
          "filingDate": "2026-05-13",
          "description": "QUARTERLY REPORT ON FORM 10-Q"
        },
        {
          "form": "10-K",
          "filingDate": "2026-03-03",
          "description": "ANNUAL REPORT ON FORM 10-K"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-11-05",
          "description": "10-Q"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-08-04",
          "description": "10-Q"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-05-06",
          "description": "10-Q"
        }
      ],
      "xbrlFacts": {
        "revenue": 1828687000,
        "netIncome": -43257000,
        "totalAssets": 2834795000,
        "grossProfit": 398817000,
        "operatingIncome": 97147000,
        "stockholdersEquity": 452925000
      }
    },
    "dataSources": [
      "Yahoo Finance",
      "SEC EDGAR",
      "Gemini AI"
    ]
  },
  {
    "ticker": "CALM",
    "companyName": "Cal-Maine Foods, Inc.",
    "sector": "Consumer Defensive",
    "industry": "Farm Products",
    "marketCapB": 4.47,
    "ebitdaMargin": 16.1,
    "peRatio": 26.3,
    "revGrowthPct": -49.9,
    "score": 4,
    "findings": "Cal-Maine Foods operates primarily in shell egg production and prepared foods rather than pure-play food retail or distribution. While it meets mid-cap criteria with a $4.47B market cap and maintains a 16.1% EBITDA margin, the company lacks documented evidence of private label growth, technology and automation adoption, or e-commerce capabilities. Furthermore, revenue growth is severely depressed at -49.9%, resulting in weak alignment with the acquisition criteria.",
    "riskFactors": "Key risks include severe revenue contraction of -49.9% and valuation exposure with a P/E ratio of 26.3. Its core focus on farm products leaves it outside the target food retail and tech-enabled distribution scope.",
    "growthDrivers": "Growth catalysts center on expanding specialty shell egg formats and prepared foods products sold through national grocery chains, club stores, and foodservice distributors. Broad product offerings under established brands like Egg-Land's Best and Land O' Lakes support market presence.",
    "decision": "ðŸ”´ DISCARD",
    "rawProfile": "Cal-Maine Foods, Inc., together with its subsidiaries, engages in the production, grading, packaging, marketing, and distribution of shell eggs, egg products, and prepared foods in the United Sates. It operates through Conventional Shell Eggs, Specialty Shell Eggs, and Prepared Foods segments. The company offers specialty shell eggs, including cage-free, organic, brown, free-range, and pasture-raised and nutritionally enhanced eggs, as well as conventional and co-pack shel…",
    "secData": {
      "cik": "0000016160",
      "recentFilings": [
        {
          "form": "10-K",
          "filingDate": "2026-07-22",
          "description": "FORM 10K"
        },
        {
          "form": "10-Q",
          "filingDate": "2026-04-01",
          "description": "FORM 10-Q"
        },
        {
          "form": "10-Q",
          "filingDate": "2026-01-07",
          "description": "FORM 10-Q"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-10-01",
          "description": "10-Q"
        },
        {
          "form": "10-K",
          "filingDate": "2025-07-22",
          "description": "10-K"
        }
      ],
      "xbrlFacts": {
        "revenue": 2911632000,
        "netIncome": 316682000,
        "totalAssets": 3107570000,
        "grossProfit": 672049000,
        "operatingIncome": 350186000,
        "stockholdersEquity": 2632732000
      }
    },
    "dataSources": [
      "Yahoo Finance",
      "SEC EDGAR",
      "Gemini AI"
    ]
  },
  {
    "ticker": "THS",
    "marketCapB": 0,
    "ebitdaMargin": 0,
    "score": "-",
    "findings": "No market data found for THS â€” ticker may be delisted, renamed, or invalid.",
    "decision": "âšª NO DATA",
    "dataSources": [
      "Yahoo Finance"
    ]
  },
  {
    "ticker": "DAR",
    "companyName": "Darling Ingredients Inc.",
    "sector": "Consumer Defensive",
    "industry": "Packaged Foods",
    "marketCapB": 9.37,
    "ebitdaMargin": 15.6,
    "peRatio": 10.9,
    "revGrowthPct": 12.3,
    "score": 1,
    "findings": "Darling Ingredients Inc. operates as a specialized processor of organic bio-nutrients, converting animal by-products and food waste into feed, food, and fuel ingredients. The company lacks any presence in food retail, downstream food distribution, private label growth, or consumer e-commerce capabilities. Consequently, it exhibits virtually no strategic alignment with the mandate for food retail and distribution acquisitions.",
    "riskFactors": "Key risks include complete strategic misalignment with the target criteria and operational exposure to volatility in bio-fuel and rendered commodity markets.",
    "growthDrivers": "Growth catalysts include expanding sustainable bio-energy and biogas conversion from organic waste, as well as global demand for specialty proteins and collagen products.",
    "decision": "ðŸ”´ DISCARD",
    "rawProfile": "Darling Ingredients Inc. develops, produces, and sells sustainable natural ingredients from edible and inedible bio-nutrients in North America, Europe, China, South America, and internationally. The Feed Ingredients segment collects and processes animal by-products into non-food grade oils and protein meals; bakery residuals into cookie meal used in poultry and swine rations; used cooking oil into non-food grade fats; and porcine and bovine blood into blood plasma powder a…",
    "secData": {
      "cik": "0000916540",
      "recentFilings": [
        {
          "form": "10-Q",
          "filingDate": "2026-05-08",
          "description": "10-Q"
        },
        {
          "form": "10-K",
          "filingDate": "2026-03-03",
          "description": "10-K"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-11-05",
          "description": "10-Q"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-08-06",
          "description": "10-Q"
        },
        {
          "form": "10-Q",
          "filingDate": "2025-05-07",
          "description": "10-Q"
        }
      ],
      "xbrlFacts": {
        "revenue": 6135877000,
        "netIncome": 62804000,
        "totalAssets": 10298782000,
        "grossProfit": 1473458000,
        "operatingIncome": 273440000,
        "stockholdersEquity": 4736911000
      }
    },
    "dataSources": [
      "Yahoo Finance",
      "SEC EDGAR",
      "Gemini AI"
    ]
  }
];
