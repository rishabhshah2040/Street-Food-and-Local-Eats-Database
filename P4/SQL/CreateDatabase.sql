
Create Database DMDDFinalProject

Use DMDDFinalProject
GO

-- Table for storing individual dishes with their details
CREATE TABLE Dish (
    DishID INT NOT NULL PRIMARY KEY,
    MenuID INT NOT NULL,
    MainIngredient VARCHAR(255) NOT NULL,
    Allergen VARCHAR(255), -- Can be NULL if the dish has no allergens
    DishName VARCHAR(255) NOT NULL,
    Description TEXT NOT NULL
);

-- Table for storing menus with associated dish prices
CREATE TABLE Menu (
    MenuID INT NOT NULL PRIMARY KEY,
    Price DECIMAL(10, 2) NOT NULL
);

-- Table for storing different types of cuisines
CREATE TABLE Cuisine (
    CuisineID INT NOT NULL PRIMARY KEY,
    CuisineType VARCHAR(255) NOT NULL
);

-- Table for storing user information
CREATE TABLE Users(
    UserID INT NOT NULL PRIMARY KEY,
    UserName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Phone VARCHAR(255), -- Can be NULL if the user prefers not to provide a phone number
    Address TEXT NOT NULL
);

-- Associative table for linking users to their favorite dishes
CREATE TABLE FavoriteDish (
    UserID INT NOT NULL,
    CuisineID INT NOT NULL,
    PRIMARY KEY (UserID, CuisineID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (CuisineID) REFERENCES Cuisine(CuisineID)
);

-- Table for storing vendor details
CREATE TABLE Vendor (
    VendorID INT NOT NULL PRIMARY KEY,
    CuisineID INT NOT NULL,
    OrganizerID INT, -- Can be NULL if the vendor is not associated with an organizer
    Name VARCHAR(255) NOT NULL,
    OpeningHours TIME NOT NULL,
    ClosingHours TIME NOT NULL,
    Contact VARCHAR(255) NOT NULL,
    FOREIGN KEY (CuisineID) REFERENCES Cuisine(CuisineID)
);

-- Table for storing ratings and reviews given by users for vendors
CREATE TABLE RatingReview (
    ReviewID INT NOT NULL PRIMARY KEY,
    UserID INT NOT NULL,
    VendorID INT NOT NULL,
    Comment TEXT, -- Can be NULL if the user rates without a comment
    ReviewDate DATE NOT NULL,
    Rating INT NOT NULL, -- Assuming the rating is a numerical value
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (VendorID) REFERENCES Vendor(VendorID)
);



-- Table for storing the location details of vendors
CREATE TABLE Location (
    LocationID INT NOT NULL PRIMARY KEY,
    VendorID INT NOT NULL,
    Street VARCHAR(255) NOT NULL,
    City VARCHAR(255) NOT NULL,
    State VARCHAR(255) NOT NULL,
    Zipcode VARCHAR(10) NOT NULL,
    FOREIGN KEY (VendorID) REFERENCES Vendor(VendorID)
);

-- Table for storing health inspection records of vendors
CREATE TABLE HealthInspection (
    InspectionID INT NOT NULL PRIMARY KEY,
    VendorID INT NOT NULL,
    Date DATE NOT NULL,
    InspectorComments TEXT, -- Can be NULL if there are no additional comments
    Score INT NOT NULL,
    FOREIGN KEY (VendorID) REFERENCES Vendor(VendorID)
);

-- Table for storing event organizer details
CREATE TABLE EventOrganizers (
    OrganizerID INT NOT NULL PRIMARY KEY,
    Email VARCHAR(255) NOT NULL,
    Phone VARCHAR(255) NOT NULL
);

-- Table for storing events details
CREATE TABLE Events (
    EventID INT NOT NULL PRIMARY KEY,
    OrganizerID INT NOT NULL,
    Description TEXT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    EventPrice DECIMAL(10, 2) Not Null
    FOREIGN KEY (OrganizerID) REFERENCES EventOrganizers(OrganizerID)
);

-- Table for storing event registration details
CREATE TABLE EventRegistration (
    RegistrationID INT NOT NULL PRIMARY KEY,
    UserID INT NOT NULL,
    EventID INT NOT NULL,
    ReservationDate DATE NOT NULL,
    NumberOfPeople INT NOT NULL, -- Assuming you must specify at least one attendee
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (EventID) REFERENCES Events(EventID)
);

-- Table for storing payment details associated with event registrations
CREATE TABLE Payment (
    PaymentID INT NOT NULL PRIMARY KEY,
    RegistrationID INT NOT NULL,
    PaymentType VARCHAR(255) NOT NULL,
    PaymentStatus VARCHAR(255) NOT NULL, -- Payment status should always be recorded
    Amount DECIMAL(10, 2),
    TaxRate DECIMAL(5, 2),
    FOREIGN KEY (RegistrationID) REFERENCES EventRegistration(RegistrationID)
);
