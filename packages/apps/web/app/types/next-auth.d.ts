declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: {
            id?: string;
            email?: string | null;
        };
    }

    interface User {
        id?: string;
        accessToken?: string;
        email?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        email?: string;
        accessToken?: string;
    }
}