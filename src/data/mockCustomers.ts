export interface Customer {
    id: string;
    customer: string; // Replacing or complementing companyName
    accountNumber: string | null;
    soldToCity: string; // New field for sold-to city
    shipTo: string; // New field for ship-to location
  }
  
export const mockCustomers: Customer[] = [
  { id: "1", customer: "Acme Corp", accountNumber: "ACME123", soldToCity: "New York", shipTo: "Brooklyn" },
  { id: "2", customer: "Beta Inc", accountNumber: "BETA456", soldToCity: "Los Angeles", shipTo: "Santa Monica" },
  { id: "3", customer: "Gamma Ltd", accountNumber: "GAMMA789", soldToCity: "Chicago", shipTo: "Evanston" },
  { id: "4", customer: "Delta Solutions", accountNumber: "DELT789", soldToCity: "Houston", shipTo: "Katy" },
  { id: "5", customer: "Epsilon Tech", accountNumber: "EPSI101", soldToCity: "San Francisco", shipTo: "Oakland" },
  { id: "6", customer: "Zeta Industries", accountNumber: "ZETA202", soldToCity: "Seattle", shipTo: "Bellevue" },
  { id: "7", customer: "Eta Enterprises", accountNumber: "ETA112", soldToCity: "Boston", shipTo: "Cambridge" },
  { id: "8", customer: "Theta Group", accountNumber: "THET223", soldToCity: "Miami", shipTo: "Coral Gables" },
  { id: "9", customer: "Iota Innovations", accountNumber: "IOTA334", soldToCity: "Denver", shipTo: "Boulder" },
  { id: "10", customer: "Kappa Co", accountNumber: "KAPPA445", soldToCity: "Phoenix", shipTo: "Scottsdale" },
  { id: "11", customer: "Lambda Labs", accountNumber: "LAMB445", soldToCity: "Portland", shipTo: "Beaverton" },
  { id: "12", customer: "Mu Manufacturing", accountNumber: "MU556", soldToCity: "Atlanta", shipTo: "Decatur" },
  { id: "13", customer: "Nu Networks", accountNumber: "NU667", soldToCity: "Austin", shipTo: "Round Rock" },
  { id: "14", customer: "Xi Systems", accountNumber: "XI778", soldToCity: "Dallas", shipTo: "Plano" },
  { id: "15", customer: "Omicron Analytics", accountNumber: "OMIC778", soldToCity: "San Diego", shipTo: "La Jolla" },
  { id: "16", customer: "Pi Productions", accountNumber: "PI889", soldToCity: "Philadelphia", shipTo: "Cherry Hill" },
  { id: "17", customer: "Rho Robotics", accountNumber: "RHO990", soldToCity: "Minneapolis", shipTo: "St. Paul" },
  { id: "18", customer: "Sigma Services", accountNumber: "SIGMA101", soldToCity: "Orlando", shipTo: "Winter Park" },
  { id: "19", customer: "Tau Trading", accountNumber: "TAU001", soldToCity: "Charlotte", shipTo: "Concord" },
  { id: "20", customer: "Upsilon Unlimited", accountNumber: "UPSI112", soldToCity: "Raleigh", shipTo: "Cary" },
  { id: "21", customer: "Phi Pharma", accountNumber: "PHI223", soldToCity: "Nashville", shipTo: "Franklin" },
  { id: "22", customer: "Chi Consulting", accountNumber: "CHI334", soldToCity: "St. Louis", shipTo: "Clayton" },
  { id: "23", customer: "Psi Power", accountNumber: "PSI334", soldToCity: "Salt Lake City", shipTo: "Provo" },
  { id: "24", customer: "Omega Outfitters", accountNumber: "OMEG445", soldToCity: "Kansas City", shipTo: "Overland Park" },
  { id: "25", customer: "Alpha Associates", accountNumber: "ALPH556", soldToCity: "Columbus", shipTo: "Dublin" },
  { id: "26", customer: "Bravo Builders", accountNumber: "BRAVO667", soldToCity: "Indianapolis", shipTo: "Carmel" },
  { id: "27", customer: "Charlie Chemicals", accountNumber: "CHAR667", soldToCity: "Cincinnati", shipTo: "Mason" },
  { id: "28", customer: "Delta Dynamics", accountNumber: "DELT778", soldToCity: "Pittsburgh", shipTo: "Cranberry" },
  { id: "29", customer: "Echo Energy", accountNumber: "ECHO889", soldToCity: "Cleveland", shipTo: "Lakewood" },
  { id: "30", customer: "Foxtrot Foods", accountNumber: "FOXT990", soldToCity: "Detroit", shipTo: "Ann Arbor" },
];
