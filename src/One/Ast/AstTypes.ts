import { Enum, Method, Interface, Class, IImportable, MethodParameter } from "./Types";

export interface IType { }
export interface ICreatableType extends IType { }

export class Type implements IType {
    static isGeneric(type: Type) {
        if (type instanceof GenericsType)
            return true;
        else if (type instanceof ClassType)
            return type.typeArguments.some(x => Type.isGeneric(x));
        else if (type instanceof InterfaceType)
            return type.typeArguments.some(x => Type.isGeneric(x));
    }

    static equals(type1: Type, type2: Type): boolean {
        if (!type1 || !type2) throw new Error("Type is missing!");
        if (type1 instanceof VoidType && type2 instanceof VoidType) return true;
        if (type1 instanceof AnyType && type2 instanceof AnyType) return true;
        if (type1 instanceof GenericsType && type2 instanceof GenericsType) return type1.typeVarName === type2.typeVarName;
        if (type1 instanceof EnumType && type2 instanceof EnumType) return type1.decl === type2.decl;
        if (type1 instanceof ClassType && type2 instanceof ClassType)
            return type1.decl === type2.decl && 
                type1.typeArguments.length === type2.typeArguments.length &&
                type1.typeArguments.every((t, i) => Type.equals(t, type2.typeArguments[i]));
        if (type1 instanceof InterfaceType && type2 instanceof InterfaceType)
            return type1.decl === type2.decl && 
                type1.typeArguments.length === type2.typeArguments.length &&
                type1.typeArguments.every((t, i) => Type.equals(t, type2.typeArguments[i]));
        return false;
    }
}

export class PrimitiveType extends Type { }

export class VoidType extends PrimitiveType { }
export class AnyType extends PrimitiveType { }

export class GenericsType extends Type {
    constructor(public typeVarName: string) { super(); }
}

export class EnumType extends Type {
    constructor(public decl: Enum) { super(); }
}

export interface IHasTypeArguments {
    typeArguments: Type[];
}

export class InterfaceType extends Type implements IHasTypeArguments {
    constructor(public decl: Interface, public typeArguments: Type[] = []) { super(); }
}

export class ClassType extends Type implements IHasTypeArguments, ICreatableType {
    constructor(public decl: Class, public typeArguments: Type[] = []) { super(); }
}

export class UnresolvedType extends Type implements IHasTypeArguments, ICreatableType {
    constructor(public typeName: string, public typeArguments: Type[] = []) { super(); }
}

export class LambdaType extends Type {
    constructor(public parameters: MethodParameter[], public returnType: Type) { super(); }
}
