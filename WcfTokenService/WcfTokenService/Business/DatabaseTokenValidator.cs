﻿using System;
using System.Linq;
using WcfTokenService.Database;
using WcfTokenService.Interfaces;
using WTS.Model.Security;
using Token = WTS.Model.Security.Token;

namespace WcfTokenService.Business
{
    public class DatabaseTokenValidator : ITokenValidator
    {
        // Todo: Set this from a web.config appSettting value
        public static double DefaultSecondsUntilTokenExpires = 1800;

        private readonly UserTokenDbContext _DbContext;

        public DatabaseTokenValidator(UserTokenDbContext dbContext)
        {
            _DbContext = dbContext;
        }

        public bool IsValid(string tokentext)
        {
            Token = _DbContext.Tokens.SingleOrDefault(t => t.TokenString == tokentext);
            return Token != null && !IsExpired(Token);
        }

        internal bool IsExpired(Token token)
        {
            var span = DateTime.Now - token.CreateDate;
            return span.TotalSeconds > DefaultSecondsUntilTokenExpires;
        }

        public WTS.Model.Security.Token Token { get; set; }
        Token ITokenValidator.Token { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
    }
}