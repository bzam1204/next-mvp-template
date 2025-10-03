export interface MemberView {
  id: string;
  cpf: string | null;
  sex: 'male' | 'female';
  email: string | null;
  phone: string | null;
  status: 'active' | 'archived';
  fullName: string;
  birthDate: string;
  createdAt: string;
  celebrant: string;
  professionOfFaithDate: string;
  placeOfBirth: string;
  //todo: add 'união estável' option
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  classification: 'communicant' | 'non-communicant';
  baptizedInInfancy: boolean;
  religiousBackground: string;
  address: {
    city: string;
    zip?: string;
    street: string;
    state?: string;
    number?: string;
    district?: string;
    complement?: string;
  };
  reception: {
    date: string;
    mode: 'profession_of_faith' | 'transfer' | 'restoration';
    location: string;
  };
}
