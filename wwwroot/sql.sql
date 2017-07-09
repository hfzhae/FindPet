/****** Object:  Table [dbo].[FindPet]    Script Date: 06/13/2017 14:15:36 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[FindPet](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[timeInput] [datetime] NULL,
	[Varieties] [nvarchar](128) NULL,
	[Gender] [nvarchar](32) NULL,
	[sterilization] [nvarchar](32) NULL,
	[color] [nvarchar](64) NULL,
	[isname] [nvarchar](64) NULL,
	[phone] [nvarchar](128) NULL,
	[memo] [nvarchar](512) NULL,
	[imgText] [nvarchar](1024) NULL,
	[placeText] [nvarchar](1024) NULL,
	[placepoint] [nvarchar](64) NULL,
	[CreateDate] [datetime] NULL,
	[isDeleted] [int] NOT NULL,
	[state] [nvarchar](32) NULL,
	[UpdatDate] [datetime] NULL,
	[isRe] [int] NOT NULL,
 CONSTRAINT [PK_FindPet] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[FindPet] ADD  CONSTRAINT [DF_FindPet_isDeleted]  DEFAULT ((0)) FOR [isDeleted]
GO

ALTER TABLE [dbo].[FindPet] ADD  CONSTRAINT [DF_FindPet_isRe]  DEFAULT ((0)) FOR [isRe]
GO

