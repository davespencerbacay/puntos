export type MembershipType = "Premium" | "Free";

export type AccountStatus = "Active" | "Pending" | "Suspended";

export interface ProfileOverviewData {
    avatarUrl: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    memberId: string;
    membershipType: MembershipType;
    accountStatus: AccountStatus;
}

export interface PersonalInformationValues {
    firstName: string;
    lastName: string;
    displayName: string;
    emailAddress: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: string;
}

export interface AddressInformationValues {
    country: string;
    provinceOrState: string;
    cityOrMunicipality: string;
    barangay: string;
    streetAddress: string;
    zipCode: string;
}

export interface AccountInformationValues {
    memberId: string;
    accountRole: string;
    membershipType: MembershipType;
    accountStatus: AccountStatus;
    registrationDate: string;
    organization: string;
}

export type PersonalInformationTouched = Record<keyof PersonalInformationValues, boolean>;
export type PersonalInformationErrors = Record<keyof PersonalInformationValues, string>;

export type AddressInformationTouched = Record<keyof AddressInformationValues, boolean>;
export type AddressInformationErrors = Record<keyof AddressInformationValues, string>;
