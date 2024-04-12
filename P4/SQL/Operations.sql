-- Stored Procedure to Get User Details
Create PROCEDURE GetUserDetails 
@UserID INT,
@UserName VARCHAR(255) OUTPUT,
@Email VARCHAR(255) OUTPUT,
@Phone VARCHAR(255) OUTPUT,
@Address VARCHAR(255) OUTPUT
AS
BEGIN
    SELECT @UserName = UserName, @Email = Email, @Phone = Phone, @Address = Address
    FROM Users
    WHERE UserID = @UserID;
END;

DECLARE @UserName VARCHAR(255), @Email VARCHAR(255), @Phone VARCHAR(255), @Address VARCHAR(MAX);
EXEC GetUserDetails @UserID = 7, @UserName = @UserName OUTPUT, @Email = @Email OUTPUT, @Phone = @Phone OUTPUT, @Address = @Address OUTPUT;
SELECT @UserName as UserName, @Email as EmailID, @Phone as PhoneNo, @Address as [Address];


-- Stored Procedure to Add a New Rating and Review:
CREATE PROCEDURE AddRatingReview
@ReviewID INT,
@UserID INT,
@VendorID INT,
@Comment TEXT,
@ReviewDate DATE,
@Rating INT
AS
BEGIN
    INSERT INTO RatingReview (ReviewID, UserID, VendorID, Comment, ReviewDate, Rating)
    VALUES (@ReviewID, @UserID, @VendorID, @Comment, @ReviewDate, @Rating);
END;

EXEC AddRatingReview @ReviewID = 116, @UserID = 2, @VendorID = 1, @Comment = 'Good service!', @ReviewDate = '2024-04-10', @Rating = 4;


-- Stored Procedure to Calculate Average Rating of a Vendor
CREATE PROCEDURE GetAverageRating
@VendorID INT,
@AverageRating FLOAT OUTPUT
AS
BEGIN
    SELECT @AverageRating = AVG(CAST(Rating AS FLOAT))
    FROM RatingReview
    WHERE VendorID = @VendorID;
END;

DECLARE @AverageRating FLOAT;
EXEC GetAverageRating @VendorID = 26, @AverageRating = @AverageRating OUTPUT;
SELECT @AverageRating AS AverageRating;

-- View for User Ratings and Reviews
CREATE VIEW UserRatingsReviews AS
SELECT 
    u.UserID, u.UserName, u.Email, 
    rr.VendorID, rr.Comment, rr.ReviewDate, rr.Rating
FROM Users u
INNER JOIN RatingReview rr ON u.UserID = rr.UserID;


-- View for Vendor Cuisine Details
CREATE VIEW VendorCuisineDetails AS
SELECT 
    v.VendorID, v.Name, v.Contact, v.OpeningHours, v.ClosingHours,
    c.CuisineType
FROM Vendor v
INNER JOIN Cuisine c ON v.CuisineID = c.CuisineID;


-- View for Event Registrations and Attendees:

CREATE VIEW EventRegistrationsAttendees AS
SELECT 
    er.EventID, e.Description, er.UserID, u.UserName, u.Email, er.NumberOfPeople
FROM EventRegistration er
INNER JOIN Events e ON er.EventID = e.EventID
INNER JOIN Users u ON er.UserID = u.UserID;


SELECT * FROM UserRatingsReviews;
SELECT * FROM VendorCuisineDetails;
SELECT * FROM EventRegistrationsAttendees;



-- Trigger to Log New Reviews
CREATE TABLE ReviewLog (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ReviewID INT,
    LogDate DATETIME,
    Action VARCHAR(50)
);

CREATE TRIGGER LogNewReview
ON RatingReview
AFTER INSERT
AS
BEGIN
    DECLARE @ReviewID INT;
    SELECT @ReviewID = INSERTED.ReviewID FROM INSERTED;
    INSERT INTO ReviewLog (ReviewID, LogDate, Action)
    VALUES (@ReviewID, GETDATE(), 'New Review Added');
END;

SELECT * from ReviewLog;

EXEC AddRatingReview @ReviewID = 117, @UserID = 2, @VendorID = 1, @Comment = 'testing trigger', @ReviewDate = '2024-04-10', @Rating = 4;

SELECT * from ReviewLog;

-- Trigger to Update User Activity
CREATE TABLE UserActivity (
    UserID INT PRIMARY KEY,
    NumberOfRegistrations INT
);

CREATE TRIGGER UpdateUserActivity
ON EventRegistration
AFTER INSERT
AS
BEGIN
    DECLARE @UserID INT;
    SELECT @UserID = INSERTED.UserID FROM INSERTED;
    IF EXISTS (SELECT * FROM UserActivity WHERE UserID = @UserID)
        UPDATE UserActivity 
        SET NumberOfRegistrations = NumberOfRegistrations + 1 
        WHERE UserID = @UserID;
    ELSE
        INSERT INTO UserActivity (UserID, NumberOfRegistrations)
        VALUES (@UserID, 1);
END;

Select * from UserActivity;

INSERT INTO EventRegistration (RegistrationID, UserID, EventID, ReservationDate, NumberOfPeople) VALUES
(102, 27, 15, '2024-02-08', 4);

Select * from UserActivity;

-- Check Constraint on User Table for Email Format
ALTER TABLE Users
ADD CONSTRAINT CHK_User_Email
CHECK (CHARINDEX('@', Email) > 0);


-- Check Constraint on RatingReview Table for Rating Values
ALTER TABLE RatingReview
ADD CONSTRAINT CHK_RatingReview_Rating
CHECK (Rating BETWEEN 1 AND 5);


-- Check Constraint on Payment Table for Payment Status
ALTER TABLE Payment
ADD CONSTRAINT CHK_Payment_Status
CHECK (PaymentStatus IN ('Completed', 'Pending', 'Failed'));


-- Check Constraint on EventRegistration Table for Number of People
ALTER TABLE EventRegistration
ADD CONSTRAINT CHK_EventRegistration_NumberOfPeople
CHECK (NumberOfPeople > 0);


-- UDF to calculate the total amount:
CREATE FUNCTION GetTotalAmount
(
    @Amount DECIMAL(10, 2),
    @TaxRate DECIMAL(5, 2)
)
RETURNS DECIMAL(10, 2)
AS
BEGIN
    RETURN @Amount + (@Amount * @TaxRate / 100.0);
END;

ALTER TABLE Payment
ADD TotalAmount AS dbo.GetTotalAmount(Amount, TaxRate);

select * from payment


-- Data Encrption on User Table on email
-- Create a Master Key
CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'NewPass123';

-- Create a Certificate
CREATE CERTIFICATE UserCertificate WITH SUBJECT = 'User Address Encryption';

-- Create a Symmetric Key
CREATE SYMMETRIC KEY UserSymmetricKey
WITH ALGORITHM = AES_256
ENCRYPTION BY CERTIFICATE UserCertificate;

ALTER TABLE Users ADD Email_Encrypted VARBINARY(MAX);

OPEN SYMMETRIC KEY UserSymmetricKey
DECRYPTION BY CERTIFICATE UserCertificate;

UPDATE Users
SET Email_Encrypted = EncryptByKey(Key_GUID('UserSymmetricKey'), Email);

CLOSE SYMMETRIC KEY UserSymmetricKey;

OPEN SYMMETRIC KEY UserSymmetricKey
DECRYPTION BY CERTIFICATE UserCertificate;

SELECT UserID, UserName, Email_Encrypted,
       CONVERT(VARCHAR(MAX), DecryptByKey(Email_Encrypted)) AS DecryptedEmail
FROM Users;

CLOSE SYMMETRIC KEY UserSymmetricKey;

-- 3 Non-Clustered Indexing Code.

CREATE NONCLUSTERED INDEX IDX_User_Email
ON Users (Email);


CREATE NONCLUSTERED INDEX IDX_RatingReview_VendorID
ON RatingReview (VendorID);

CREATE NONCLUSTERED INDEX IDX_EventRegistration_EventID_UserID
ON EventRegistration (EventID, UserID);


