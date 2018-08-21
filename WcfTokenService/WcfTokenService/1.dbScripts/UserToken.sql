
IF NOT EXISTS (SELECT * FROM sysobjects where name = 'GOT_USER')
BEGIN
	CREATE TABLE GOT_USER (
		 [GOT_USER_ID] int identity(1,1) primary key not null
		,[GOT_USER_USERNAME] nvarchar(50) not null
		,[GOT_USER_PASSWORD] nvarchar(250) not null
		,[GOT_USER_SALT] nvarchar(250) not null
		,[GOT_USER_ROLE] nvarchar(50) not null
		)	
END
GO
IF NOT EXISTS (SELECT * FROM sysobjects where name = 'GOT_TOKEN')
BEGIN
	CREATE TABLE GOT_TOKEN (
		 [GOT_TOKEN_ID] int identity(1,1) primary key not null
		,[GOT_TOKEN_TOKEN] nvarchar(50) not null
		,[GOT_USER_ID] INT
		,[GOT_TOKEN_CREATED_DATE] DATETIME not null
		)	
		ALTER TABLE [dbo].GOT_TOKEN  WITH CHECK ADD CONSTRAINT [FK_GOT_TOKEN_GOT_USER_ID] FOREIGN KEY([GOT_USER_ID])
	REFERENCES [dbo].[GOT_USER] ([GOT_USER_ID])
END
GO
