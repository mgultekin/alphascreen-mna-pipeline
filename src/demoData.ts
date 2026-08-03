// AUTO-CAPTURED DEMO DATA — real output from a live food-retail screening run.
// Lets visitors explore the full UI instantly, without a Gemini API key.
// Includes AI scores, confidence, catalysts, and SEC/deal-metric data.
// Regenerate by running a screen and saving the streamed results here.
import { ScreeningResult } from './types';

export const DEMO_RESULTS: ScreeningResult[] = [
  {
    "ticker": "UNFI",
    "companyName": "United Natural Foods, Inc.",
    "sector": "Consumer Defensive",
    "industry": "Food Distribution",
    "marketCapB": 2.87,
    "ebitdaMargin": 1.8,
    "peRatio": 14.7,
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
    "ticker": "KR",
    "companyName": "The Kroger Co.",
    "sector": "Consumer Defensive",
    "industry": "Grocery Stores",
    "marketCapB": 35.67,
    "ebitdaMargin": 5.4,
    "peRatio": 10.5,
    "revGrowthPct": 2.2,
    "score": 4,
    "confidence": "High",
    "findings": "While The Kroger Co. demonstrates strong market presence with e-commerce capabilities and integrated food manufacturing, its $35.67B market cap significantly exceeds the target criteria's focus on mid-cap companies. Furthermore, its EBITDA margin of 5.4% does not meet the mandate for strong margins, reflecting standard low-margin grocery operations. Consequently, the company is too large and margin-constrained to serve as a target for this specific mid-cap strategy.",
    "riskFactors": "High Net Debt/EBITDA of 2.6x alongside modest revenue growth of 2.2% presents operational and leverage risks. In addition, thin operating margins leave little buffer against input cost inflation and competitive pressures.",
    "growthDrivers": "Leveraging omnichannel expansion across digital platforms and physical store formats drives ongoing sales reach. Internal food processing and manufacturing capabilities offer operational support and product differentiation.",
    "catalyst": "A recent 8-K filing on June 26, 2026, announced a director or officer departure or appointment.",
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
      },
      "recentEventCount": 4,
      "recentEventDates": [
        "2026-07-01 [Other event]",
        "2026-06-26 [Director/officer departure or appointment, 5.07, Financial statements/exhibits]",
        "2026-06-18 [2.02, Financial statements/exhibits]"
      ]
    },
    "dataSources": [
      "Yahoo Finance",
      "SEC EDGAR",
      "Gemini AI"
    ]
  },
  {
    "ticker": "SFM",
    "companyName": "Sprouts Farmers Market, Inc.",
    "sector": "Consumer Defensive",
    "industry": "Grocery Stores",
    "marketCapB": 8.28,
    "ebitdaMargin": 9.4,
    "peRatio": 14.9,
    "revGrowthPct": 4.7,
    "score": 8,
    "confidence": "High",
    "findings": "Sprouts Farmers Market aligns strongly with the targeted mid-cap food retail focus, generating $8.8B in revenue with a strong EBITDA margin of 9.4% and gross profit of $3.4B. The company demonstrates brand strength in natural and organic food categories with its proprietary Sprouts brand products. Minor gaps exist regarding explicit data on supply chain automation or e-commerce capabilities in the provided disclosures.",
    "riskFactors": "Net debt to EBITDA of 2.2x and a modest revenue growth rate of 4.7% present moderate financial leverage and top-line growth constraints. Leadership transitions indicated in recent filings could also introduce operational execution risks.",
    "growthDrivers": "Continued expansion of private label Sprouts-branded natural and organic offerings presents a clear higher-margin growth driver. Consolidation opportunities and footprint expansion in specialized grocery sub-segments further support long-term upside.",
    "catalyst": "Sprouts Farmers Market reported a director or officer departure or appointment in an 8-K filing on May 19, 2026.",
    "decision": "ðŸŸ¢ DEEP DIVE",
    "rawProfile": "Sprouts Farmers Market, Inc., together with its subsidiaries, engages in the retailing of fresh, natural, and organic food products in the United States. The company offers healthy grocery stores; and lifestyle-friendly ingredients such as organic, plant-based, keto, paleo, non-GMO, and gluten-free. The company also offers perishable product categories, including produce, meat and meat alternatives, seafood, deli, bakery, floral, and dairy alternatives; and non-perishable …",
    "secData": {
      "cik": "0001575515",
      "recentFilings": [
        {
          "form": "10-Q",
          "filingDate": "2026-07-29",
          "description": "10-Q"
        },
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
        }
      ],
      "xbrlFacts": {
        "revenue": 8806159000,
        "netIncome": 523670000,
        "totalAssets": 4158649000,
        "grossProfit": 3416389000,
        "operatingIncome": 686158000,
        "stockholdersEquity": 1403074000
      },
      "recentEventCount": 4,
      "recentEventDates": [
        "2026-07-29 [2.02, Other event, Financial statements/exhibits]",
        "2026-05-21 [5.07]",
        "2026-05-19 [Director/officer departure or appointment, Financial statements/exhibits]"
      ]
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
    "marketCapB": 5.63,
    "ebitdaMargin": 4.2,
    "peRatio": 6.1,
    "revGrowthPct": 0.2,
    "score": "-",
    "findings": "Screened out: EBITDA Margin (4.2%) below 5% minimum",
    "decision": "âšª SCREENED OUT",
    "rawProfile": "Albertsons Companies, Inc., through its subsidiaries, operates in the food and drug retail industry in the United States. The company's food and drug retail stores offer grocery products, general merchandise, health and beauty care products, pharmacy, vaccines, fuel, and other items and services. It also operates stores under various banners, including Albertsons, Safeway, Vons, Pavilions, Randalls, Tom Thumb, Carrs, Jewel-Osco, ACME, Shaw's, Star Market, United Supermarke…",
    "dataSources": [
      "Yahoo Finance"
    ]
  },
  {
    "ticker": "CASY",
    "companyName": "Casey's General Stores, Inc.",
    "sector": "Consumer Cyclical",
    "industry": "Specialty Retail",
    "marketCapB": 31.84,
    "ebitdaMargin": 8.5,
    "peRatio": 36.4,
    "revGrowthPct": 14.5,
    "score": "-",
    "findings": "Screened out: P/E Ratio (36.4) exceeds 30x maximum",
    "decision": "âšª SCREENED OUT",
    "rawProfile": "Casey's General Stores, Inc., together with its subsidiaries, operates convenience stores under the Casey's and Casey's General Store names in the United States. Its stores offer pizza, donuts, hot breakfast items, and sandwiches; and beverages, tobacco and nicotine products. The company's stores also provide soft drinks, energy, water, sports drinks, juices, coffee, and tea and dairy products; beer, wine, and spirits; snacks, candy, packaged bakery, and other food items; …",
    "dataSources": [
      "Yahoo Finance"
    ]
  },
  {
    "ticker": "GO",
    "companyName": "Grocery Outlet Holding Corp.",
    "sector": "Consumer Defensive",
    "industry": "Grocery Stores",
    "marketCapB": 0.96,
    "ebitdaMargin": 4.4,
    "peRatio": 15.6,
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
    "ticker": "CHEF",
    "companyName": "The Chefs' Warehouse, Inc.",
    "sector": "Consumer Defensive",
    "industry": "Food Distribution",
    "marketCapB": 4.54,
    "ebitdaMargin": 5.9,
    "peRatio": 37.2,
    "revGrowthPct": 12.9,
    "score": "-",
    "findings": "Screened out: P/E Ratio (37.2) exceeds 30x maximum",
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
    "marketCapB": 17.96,
    "ebitdaMargin": 2.6,
    "peRatio": 20,
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
    "marketCapB": 1.74,
    "ebitdaMargin": 5,
    "peRatio": 19.5,
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
    "marketCapB": 21.95,
    "ebitdaMargin": 4.3,
    "peRatio": 18.2,
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
    "marketCapB": 0.77,
    "ebitdaMargin": 7.3,
    "peRatio": 14.4,
    "revGrowthPct": 0.5,
    "score": 5,
    "confidence": "High",
    "findings": "Natural Grocers aligns with food retail criteria through its strong focus on organic groceries and extensive private label product offerings. However, the company exhibits stagnant top-line revenue growth of 0.5% and offers no evidence of e-commerce capabilities, supply chain innovation, or technology and automation adoption in the provided profile. Furthermore, its modest 7.3% EBITDA margin and $0.77B market cap place it at the lower threshold of the target criteria.",
    "riskFactors": "Key risks include near-flat revenue growth of 0.5% and a elevated debt profile with a Net Debt to EBITDA ratio of 3.1x. The lack of documented e-commerce and technological infrastructure poses additional operational risk in a competitive retail landscape.",
    "growthDrivers": "Growth potential rests on expanding its comprehensive private label portfolio across dietary supplements and grocery staples. Further market penetration in natural and organic foods within its regional store network presents additional upsides.",
    "catalyst": "None identified.",
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
        "revenue": 1330836000,
        "netIncome": 46444000,
        "totalAssets": 670504000,
        "grossProfit": 397877000,
        "operatingIncome": 61990000,
        "stockholdersEquity": 212395000
      },
      "recentEventCount": 1,
      "recentEventDates": [
        "2026-05-07 [2.02, Financial statements/exhibits]"
      ]
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
    "marketCapB": 40.68,
    "ebitdaMargin": 5.5,
    "peRatio": 17.2,
    "revGrowthPct": 4.7,
    "score": 4,
    "confidence": "High",
    "findings": "Sysco Corporation operates directly in food distribution, but with a market cap of $40.68B, it is a large-cap market leader rather than a mid-cap target. Additionally, its EBITDA margin of 5.5% falls short of the strategic mandate's focus on strong margins. While its $81.37B in revenue demonstrates global reach across foodservice operations, its massive scale precludes it from fitting the mid-cap profile.",
    "riskFactors": "A Net Debt/EBITDA leverage ratio of 3.0x creates financial vulnerability given thin 5.5% EBITDA margins. Furthermore, acquiring a global firm of this size presents significant regulatory and antitrust risks.",
    "growthDrivers": "Growth is propelled by 4.7% revenue expansion across international and domestic foodservice operations. Its broad distribution footprint serving restaurants, education, and healthcare venues provides reliable ongoing market demand.",
    "catalyst": "None identified.",
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
      },
      "recentEventCount": 4,
      "recentEventDates": [
        "2026-07-02 [Other event]",
        "2026-05-18 [Other event, Financial statements/exhibits]",
        "2026-04-28 [2.02, Financial statements/exhibits]"
      ]
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
    "marketCapB": 0.05,
    "ebitdaMargin": 5.8,
    "peRatio": 4.9,
    "revGrowthPct": -13.3,
    "score": 2,
    "confidence": "High",
    "findings": "The Hain Celestial Group is a packaged foods manufacturer rather than a food retail and distribution company, failing to match the core business model criteria. Additionally, with a market capitalization of $0.05B, an EBITDA margin of 5.8%, and revenue growth of -13.3%, it lacks the mid-cap scale, strong margins, and growth profile required.",
    "riskFactors": "The company exhibits high leverage with a Net Debt/EBITDA of 6.6x alongside significant profitability challenges, including an operating income of -$462M and a net income of -$531M.",
    "growthDrivers": "Growth drivers are primarily reliant on its portfolio of organic, tea, and natural product brands across retail, e-commerce, and international distribution channels.",
    "catalyst": "The company filed an 8-K on April 17, 2026, reporting a director or officer departure or appointment.",
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
        "revenue": 1559780000,
        "netIncome": -530841000,
        "totalAssets": 1603278000,
        "grossProfit": 334058000,
        "operatingIncome": -461603000,
        "stockholdersEquity": 475005000
      },
      "recentEventCount": 2,
      "recentEventDates": [
        "2026-05-11 [2.02, Financial statements/exhibits]",
        "2026-04-17 [Director/officer departure or appointment, Financial statements/exhibits]"
      ]
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
    "marketCapB": 1.94,
    "ebitdaMargin": 5.1,
    "peRatio": 19.3,
    "revGrowthPct": 4.6,
    "score": 7,
    "confidence": "High",
    "findings": "Weis Markets represents a mid-cap food retail target ($1.94B market cap, $4.96B revenue) with a established regional footprint across seven Mid-Atlantic states. The company features a strong balance sheet with net cash (-0.1x Net Debt/EBITDA) and consistent 4.6% revenue growth. While meeting regional presence criteria, it shows minor gaps with a 5.1% EBITDA margin and a lack of explicit data on private label or automation initiatives.",
    "riskFactors": "The company operates with modest EBITDA margins of 5.1% in a competitive grocery sector. Growth and profitability remain tied to regional economic stability in its core Mid-Atlantic markets.",
    "growthDrivers": "Growth is driven by steady top-line expansion of 4.6% across its seven-state store network. Its debt-free balance sheet provides financial flexibility for store reinvestment or consolidation opportunities.",
    "catalyst": "None identified.",
    "decision": "ðŸŸ¢ DEEP DIVE",
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
        "revenue": 4957709000,
        "netIncome": 93691000,
        "totalAssets": 2027359000,
        "grossProfit": 1239863000,
        "operatingIncome": 113653000,
        "stockholdersEquity": 1351910000
      },
      "recentEventCount": 2,
      "recentEventDates": [
        "2026-05-06 [2.02, Financial statements/exhibits]",
        "2026-04-30 [5.07]"
      ]
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
    "marketCapB": 0.29,
    "ebitdaMargin": 14.1,
    "peRatio": 6.3,
    "revGrowthPct": -3.9,
    "score": 3,
    "confidence": "High",
    "findings": "B&G Foods operates as a branded packaged food manufacturer rather than a mid-cap food retail or distribution business, failing to align with the strategic mandate. The company lacks explicit focus on private label growth, e-commerce innovation, or technology-driven operational efficiencies. Additionally, with a market cap of $0.29B and declining revenue (-3.9%), it falls short of strategic priorities.",
    "riskFactors": "Extremely elevated leverage with Net Debt/EBITDA at 7.8x and negative net income of -$43M present significant financial risk. Ongoing top-line contraction (-3.9%) further pressures operational cash flow.",
    "growthDrivers": "Portfolio rationalization and divestiture of non-core brand segments could help reduce net debt. Channel expansion across foodservice and mass merchants provides incremental volume potential.",
    "catalyst": "In June 2026, the company filed multiple 8-Ks announcing entry into material agreements and new financial obligations under Item 2.03.",
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
      },
      "recentEventCount": 6,
      "recentEventDates": [
        "2026-06-10 [Material agreement, 2.03, Financial statements/exhibits]",
        "2026-06-04 [Material agreement, Other event, Financial statements/exhibits]",
        "2026-06-01 [Other event, Financial statements/exhibits]"
      ]
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
    "marketCapB": 4.08,
    "ebitdaMargin": 16.1,
    "peRatio": 24.3,
    "revGrowthPct": -49.9,
    "score": 3,
    "confidence": "High",
    "findings": "Cal-Maine Foods operates primarily as an egg producer in the farm products sector, which deviates from the core focus on food retail and distribution. While the company maintains an EBITDA margin of 16.1% and mid-cap scale, there is no evidence of private label growth, supply chain innovation, e-commerce capabilities, or tech adoption in the provided data. Overall, the business shows limited strategic alignment with the defined investment focus.",
    "riskFactors": "The company faces severe revenue contraction, highlighted by a -49.9% revenue growth rate. High commodity price sensitivity in conventional shell eggs creates substantial top-line instability.",
    "growthDrivers": "Growth potential relies on expanding specialty shell egg categories and prepared food brand offerings like Egg-Land's Best across grocery and foodservice channels. A negative net debt position of -2.0x Net Debt/EBITDA provides financial stability for organic investments.",
    "catalyst": "Cal-Maine Foods filed an 8-K on June 23, 2026, reporting a director or officer departure or appointment.",
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
      },
      "recentEventCount": 3,
      "recentEventDates": [
        "2026-07-22 [2.02, Financial statements/exhibits]",
        "2026-06-30 [Other event, Financial statements/exhibits]",
        "2026-06-23 [Director/officer departure or appointment, Other event, Financial statements/exhibits]"
      ]
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
    "peRatio": 17.8,
    "revGrowthPct": 8,
    "score": 6,
    "confidence": "High",
    "findings": "John B. Sanfilippo & Son, Inc. aligns with the mid-cap food distribution space and offers private label manufacturing alongside a healthy 0.8x Net Debt/EBITDA. However, its EBITDA margin is modest at 10.4%, and the provided data lacks explicit details on e-commerce capabilities, operational automation, or regional market dominance.",
    "riskFactors": "Key risks include modest EBITDA margins of 10.4% and exposure to price volatility in raw tree nuts and peanut commodities.",
    "growthDrivers": "Growth is driven by steady 8.0% revenue expansion across private brands and branded snack lines through retail, wholesale, and contract packaging channels.",
    "catalyst": "A management shift occurred recently as disclosed in an 8-K filing on July 16, 2026 regarding a director or officer departure or appointment.",
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
      },
      "recentEventCount": 3,
      "recentEventDates": [
        "2026-07-16 [Director/officer departure or appointment]",
        "2026-07-15 [Other event, Financial statements/exhibits]",
        "2026-04-29 [2.02, Financial statements/exhibits]"
      ]
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
    "marketCapB": 9.5,
    "ebitdaMargin": 17.2,
    "peRatio": 10.4,
    "revGrowthPct": 16.4,
    "score": 2,
    "confidence": "High",
    "findings": "Darling Ingredients operates in animal by-product processing, bio-nutrients, feed, fuel, and specialty food ingredients rather than food retail or distribution. While the company demonstrates a 17.2% EBITDA margin and 16.4% revenue growth, it lacks the required focus on food retail, private label growth, e-commerce, or retail distribution networks. As a result, the target falls outside the strategic criteria established by the deal team.",
    "riskFactors": "High debt leverage with a Net Debt/EBITDA ratio of 3.8x poses financial risk. Additionally, exposure to volatile commodity pricing across feed, fuel, and bio-nutrient segments creates earnings variability.",
    "growthDrivers": "Growth is supported by expanding demand for sustainable bio-nutrients, organic fertilizers, and renewable fuel feedstocks. Broad international market exposure across its Feed, Food, and Fuel Ingredients segments underpins its 16.4% revenue growth.",
    "catalyst": "None identified.",
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
      },
      "recentEventCount": 4,
      "recentEventDates": [
        "2026-07-30 [2.02, Other event, Financial statements/exhibits]",
        "2026-05-11 [Other event, Financial statements/exhibits]",
        "2026-05-08 [5.07]"
      ]
    },
    "dataSources": [
      "Yahoo Finance",
      "SEC EDGAR",
      "Gemini AI"
    ]
  }
];
